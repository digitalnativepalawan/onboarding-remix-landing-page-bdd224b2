CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: app_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    icon text DEFAULT 'LayoutDashboard'::text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message text NOT NULL,
    author_name text DEFAULT 'Anonymous'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: app_links app_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_links
    ADD CONSTRAINT app_links_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: app_links update_app_links_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_app_links_updated_at BEFORE UPDATE ON public.app_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: feedback Anyone can submit feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);


--
-- Name: feedback Anyone can view feedback; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view feedback" ON public.feedback FOR SELECT USING (true);


--
-- Name: app_links App links are publicly readable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "App links are publicly readable" ON public.app_links FOR SELECT USING (true);


--
-- Name: app_links App links can be managed; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "App links can be managed" ON public.app_links USING (true) WITH CHECK (true);


--
-- Name: app_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_links ENABLE ROW LEVEL SECURITY;

--
-- Name: feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;