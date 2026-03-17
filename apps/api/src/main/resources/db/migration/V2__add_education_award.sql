create table education (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    institution_name varchar(200) not null,
    degree_ko text not null,
    degree_en text,
    major_ko text not null,
    major_en text,
    period_label_ko text not null,
    period_label_en text
);

create table award (
    id bigserial primary key,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    status varchar(20) not null,
    sort_order integer not null default 0,
    published_at timestamptz,
    award_type varchar(50) not null,
    title_ko text not null,
    title_en text,
    issuer_ko text not null,
    issuer_en text,
    period_label varchar(50) not null,
    description_ko text,
    description_en text
);
