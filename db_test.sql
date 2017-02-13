INSERT INTO public.branch (code, address) values (1001, 'Av algo, 123, São Paulo, Brasil');
INSERT INTO public.branch (code, address) values (1002, 'Rua Legal, 2345, Salvador, Bahia, Brasil');

INSERT INTO public.client (name, cpf, branch, account, amount, password) VALUES ('Anderson Tavares', '845543278', 1001, 34324, 500.00, 'anderson');
INSERT INTO public.client (name, cpf, branch, account, amount, password) VALUES ('Fulano da Silva' , '414081831', 1002, 72354, 700.00, 'fulano');

INSERT INTO public.transaction (origin, destiny, amount, tdate) VALUES (1, 2, 250, now());