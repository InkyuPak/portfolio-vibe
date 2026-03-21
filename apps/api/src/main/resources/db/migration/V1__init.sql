create table admin_user (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    username varchar(120) not null unique,
    password_hash varchar(200) not null,
    display_name varchar(120) not null
);

create table site_settings (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    hero_title_ko text not null,
    hero_title_en text,
    hero_subtitle_ko text not null,
    hero_subtitle_en text,
    hero_description_ko text not null,
    hero_description_en text,
    contact_email varchar(150) not null,
    contact_phone varchar(50),
    github_url varchar(255),
    linked_in_url varchar(255)
);

create table achievement (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    title_ko text not null,
    title_en text,
    summary_ko text not null,
    summary_en text,
    metric varchar(100) not null,
    accent varchar(50)
);

create table resume_asset (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    language_code varchar(20) not null unique,
    label_ko text not null,
    label_en text,
    file_name varchar(255) not null,
    file_url varchar(500) not null
);

create table skill_group (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    group_key varchar(100) not null unique,
    title_ko text not null,
    title_en text
);

create table skill_item (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    skill_group_id bigint not null references skill_group(id) on delete cascade,
    name varchar(120) not null,
    description_ko text not null,
    description_en text,
    sort_order integer not null default 0
);

create table experience_item (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    company_name varchar(160) not null,
    role_ko text not null,
    role_en text,
    summary_ko text not null,
    summary_en text,
    period_label_ko text not null,
    period_label_en text,
    highlights_ko text not null,
    highlights_en text,
    stack_summary text,
    location varchar(160)
);

create table project (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    slug varchar(150) not null unique,
    title_ko text not null,
    title_en text,
    subtitle_ko text not null,
    subtitle_en text,
    overview_ko text not null,
    overview_en text,
    problem_ko text not null,
    problem_en text,
    role_ko text not null,
    role_en text,
    architecture_ko text not null,
    architecture_en text,
    outcome_ko text not null,
    outcome_en text,
    featured boolean not null default false,
    theme_color varchar(30),
    cover_image_url varchar(500)
);

create table project_section (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    project_id bigint not null references project(id) on delete cascade,
    section_type varchar(30) not null,
    title_ko text not null,
    title_en text,
    payload jsonb not null,
    sort_order integer not null default 0
);

create table contact_message (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    name varchar(120) not null,
    email varchar(160) not null,
    company varchar(160),
    message text not null,
    status varchar(30) not null
);

create table media_asset (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    original_file_name varchar(255) not null,
    storage_key varchar(255) not null unique,
    content_type varchar(120) not null,
    size bigint not null,
    public_url varchar(500) not null,
    alt_ko text not null,
    alt_en text,
    caption_ko text,
    caption_en text
);
