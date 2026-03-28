-- Remove "수료" degree label from 서울과학기술대학교
UPDATE education
SET degree_ko = '',
    degree_en = '',
    updated_at = now()
WHERE institution_name = '서울과학기술대학교';

-- Add 더조은아카데미학원 Java backend training course
INSERT INTO award (
    created_at, updated_at, status, sort_order, published_at,
    award_type,
    title_ko, title_en,
    issuer_ko, issuer_en,
    period_label,
    description_ko, description_en
) VALUES (
    now(), now(), 'PUBLISHED', 6, now(),
    'EDUCATION_COURSE',
    '[더조은아카데미] 자바 웹개발&앱개발자 (시큐어코딩, Docker)',
    '[Jooeun Academy] Java Web & App Developer (Secure Coding, Docker)',
    '더조은아카데미학원',
    'Jooeun Academy',
    '2023.02 - 2023.09',
    '자바 백엔드 풀스택 교육 과정. Spring, 시큐어코딩, Docker, Java 웹/앱 개발 실습.',
    'Java backend full-stack training. Covered Spring, Secure Coding, Docker, and Java web/app development.'
);
