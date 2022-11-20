ALTER TABLE IF EXISTS ONLY public."Boats" DROP CONSTRAINT IF EXISTS boats_pk;
ALTER TABLE IF EXISTS public."Boats" ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public."Boats";

CREATE TABLE public."Boats" (
    id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    heading double precision NOT NULL,
    "time" timestamp without time zone DEFAULT (now())::timestamp without time zone,
    name character varying NOT NULL
);


CREATE SEQUENCE public."Boats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ONLY public."Boats" ALTER COLUMN id SET DEFAULT nextval('public."Boats_id_seq"'::regclass);

ALTER TABLE ONLY public."Boats"
    ADD CONSTRAINT boats_pk PRIMARY KEY (id);

