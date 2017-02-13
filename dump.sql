DROP TABLE IF EXISTS public.client CASCADE;
DROP TABLE IF EXISTS public.branch CASCADE;
DROP TABLE IF EXISTS public.transaction CASCADE;
DROP DOMAIN IF EXISTS password CASCADE;
DROP FUNCTION IF EXISTS trg_crypt_user_pass();
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
CREATE EXTENSION IF NOT EXISTS address_standardizer WITH SCHEMA public;
COMMENT ON EXTENSION address_standardizer IS 'Used to parse an address into constituent elements. Generally used to support geocoding address normalization step.';
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';
SET search_path = public, pg_catalog;
CREATE DOMAIN password AS text;
CREATE FUNCTION create_profile() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO profile (id) VALUES (new.id);
  RETURN new;
END;
$$;
CREATE FUNCTION password_beq(leftp password, rightp password) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
DECLARE
    left_crypted bool;
    right_crypted bool;
BEGIN
    left_crypted := ( substr(leftp, 1, 4) = '$2a$' );
    right_crypted := ( substr(rightp, 1, 4) = '$2a$' );
    IF (left_crypted) AND (NOT right_crypted) THEN
        RETURN crypt(rightp, leftp)::TEXT = leftp::TEXT;
    END IF;
    IF (NOT left_crypted) AND (right_crypted) THEN
        RETURN crypt(leftp, rightp)::TEXT = rightp::TEXT;
    END IF;
    RETURN leftp::TEXT = rightp::TEXT;
END;
$_$;
CREATE FUNCTION password_bne(password, password) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT NOT password_beq($1, $2);
$_$;
CREATE FUNCTION password_leq(password, text) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT crypt($2, $1) = $1::text;
$_$;
CREATE FUNCTION password_lne(password, text) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT crypt($2, $1) <> $1::text;
$_$;
CREATE FUNCTION password_req(text, password) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT crypt($1, $2) = $2::text;
$_$;
CREATE FUNCTION password_rne(text, password) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT crypt($1, $2) <> $2::text;
$_$;
CREATE FUNCTION trg_crypt_user_pass() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
BEGIN
    IF substr(NEW.password, 1, 4) <> '$2a$' THEN
        NEW.password := crypt( NEW.password, gen_salt('bf',8) );
    END IF;
    RETURN NEW;
END;
$_$;
CREATE OPERATOR <> (
    PROCEDURE = password_lne,
    LEFTARG = password,
    RIGHTARG = text,
    NEGATOR = =
);
CREATE OPERATOR <> (
    PROCEDURE = password_rne,
    LEFTARG = text,
    RIGHTARG = password,
    NEGATOR = =
);
CREATE OPERATOR <> (
    PROCEDURE = password_bne,
    LEFTARG = password,
    RIGHTARG = password,
    NEGATOR = =
);
CREATE OPERATOR = (
    PROCEDURE = password_leq,
    LEFTARG = password,
    RIGHTARG = text,
    NEGATOR = <>
);
CREATE OPERATOR = (
    PROCEDURE = password_req,
    LEFTARG = text,
    RIGHTARG = password,
    NEGATOR = <>
);
CREATE OPERATOR = (
    PROCEDURE = password_beq,
    LEFTARG = password,
    RIGHTARG = password,
    NEGATOR = <>
);
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE branch (
  code SERIAL PRIMARY KEY NOT NULL,
  address TEXT
);

CREATE TABLE client (
  id serial PRIMARY KEY NOT NULL,
  cpf char(9) NOT NULL ,
  branch integer REFERENCES branch(code) NOT NULL,
  account serial NOT NULL,
  amount numeric(10,2) NOT NULL,
  password password NOT NULL,
  lastlogindate timestamp without time zone,
  registerdate timestamp without time zone DEFAULT now() NOT NULL,
  CONSTRAINT account_unique UNIQUE (branch, account),
  CONSTRAINT login_check CHECK ((lastlogindate > registerdate))
);

CREATE TABLE transaction (
  origin integer REFERENCES client(id),
  destiny integer REFERENCES client(id),
  amount numeric(10,2) NOT NULL,
  tdate timestamp without time zone
);

ALTER SEQUENCE client_account_seq RESTART WITH 10000;
CREATE TRIGGER trg_crypt_user_pass BEFORE INSERT OR UPDATE ON public.client FOR EACH ROW EXECUTE PROCEDURE trg_crypt_user_pass();