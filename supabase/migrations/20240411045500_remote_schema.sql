revoke delete on table "public"."profile" from "anon";

revoke insert on table "public"."profile" from "anon";

revoke references on table "public"."profile" from "anon";

revoke select on table "public"."profile" from "anon";

revoke trigger on table "public"."profile" from "anon";

revoke truncate on table "public"."profile" from "anon";

revoke update on table "public"."profile" from "anon";

revoke delete on table "public"."profile" from "authenticated";

revoke insert on table "public"."profile" from "authenticated";

revoke references on table "public"."profile" from "authenticated";

revoke select on table "public"."profile" from "authenticated";

revoke trigger on table "public"."profile" from "authenticated";

revoke truncate on table "public"."profile" from "authenticated";

revoke update on table "public"."profile" from "authenticated";

revoke delete on table "public"."profile" from "service_role";

revoke insert on table "public"."profile" from "service_role";

revoke references on table "public"."profile" from "service_role";

revoke select on table "public"."profile" from "service_role";

revoke trigger on table "public"."profile" from "service_role";

revoke truncate on table "public"."profile" from "service_role";

revoke update on table "public"."profile" from "service_role";

alter table "public"."profile" drop constraint "profile_email_key";

alter table "public"."profile" drop constraint "public_profile_user_id_fkey";

alter table "public"."profile" drop constraint "profile_pkey";

drop index if exists "public"."profile_email_user_id_id_idx";

drop index if exists "public"."profile_email_key";

drop index if exists "public"."profile_pkey";

drop table "public"."profile";

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "display_name" text,
    "role" role not null default 'user'::role,
    "created_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX profile_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profile_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."profiles" add constraint "profile_email_key" UNIQUE using index "profile_email_key";

alter table "public"."profiles" add constraint "public_profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "public_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


