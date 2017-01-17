--
-- File generated with SQLiteStudio v3.1.1 on mar ene 17 17:09:16 2017
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Empresas
CREATE TABLE Empresas (IdEmpresa integer primary key, RazonSocial text, IdTipoEmpresa text, IdEstadoEmpresa text);
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (1, 'PROMIGAS', 'TIPEMPBASE', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (2, 'PROMIORIENTE', 'TIPEMPBASE', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (3, 'ESECO', 'TIPEMPCONT', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (4, 'ICA INGENIERIA', 'TIPEMPCONT', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (5, 'PROMISOL', 'TIPEMPBASE', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (6, 'TRANSMETANO', 'TIPEMPBASE', 'EMPRACTIVO');
INSERT INTO Empresas (IdEmpresa, RazonSocial, IdTipoEmpresa, IdEstadoEmpresa) VALUES (7, 'TRANSOCCIDENTE', 'TIPEMPBASE', 'EMPRACTIVO');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
