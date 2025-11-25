-- Insert sample guestbook entries from famous personalities in tech and culture

INSERT INTO guestbook (id, name, message, created_at) VALUES

-- Tech Industry Leaders
('1', 'Steve Jobs', '혁신과 단순함이 만나는 순간, 바이브 코딩처럼 새로운 경험이 탄생한다. 함께 만드는 미래를 응원합니다.', now() - interval '20 days'),
('2', 'Bill Gates', 'Next.js와 같은 기술이 전 세계 개발자들의 생산성을 높이고 있습니다. 바이브 코딩의 여정에 축하를 보냅니다.', now() - interval '18 days'),
('3', 'Satya Nadella', 'Cloud 시대에 필요한 것은 기술력과 열정입니다. 바이브 코딩이 보여주는 열정에 깊은 감명을 받습니다.', now() - interval '16 days'),
('4', 'Sundar Pichai', 'AI와 웹 기술의 결합은 무한한 가능성을 열어줍니다. 바이브 코딩의 도전이 세상을 더 밝게 만들길 바랍니다.', now() - interval '14 days'),
('5', 'Tim Cook', '디자인과 기능의 완벽한 조화. 바이브 코딩의 포트폴리오에서 그것을 봅니다. 계속해서 좋은 제품을 만들어 주세요.', now() - interval '12 days'),
('6', 'Jensen Huang', 'GPU 시대의 AI 혁명을 이끄는 개발자들의 노력에 감사합니다. 바이브 코딩의 성장을 응원합니다!', now() - interval '10 days'),
('7', 'Mark Zuckerberg', '커뮤니티를 만드는 것이 가장 중요합니다. 바이브 코딩처럼 사람들을 연결하는 플랫폼을 만드는 모든 분을 응원합니다.', now() - interval '8 days'),
('8', 'Elon Musk', '불가능을 가능하게 만드는 것이 엔지니어의 소명입니다. 바이브 코딩의 대담한 도전을 응원합니다!', now() - interval '6 days'),

-- Tech Visionaries
('9', 'Guido van Rossum', 'Python이 프로그래밍을 민주화했다면, 바이브 코딩은 Next.js 생태계를 더욱 풍요롭게 만들고 있습니다. 감사합니다!', now() - interval '5 days'),
('10', 'Linus Torvalds', 'Open source 정신으로 만들어지는 모든 프로젝트를 존경합니다. 바이브 코딩도 그 정신을 담고 있네요. 훌륭합니다!', now() - interval '4 days'),

-- Business & Leadership
('11', 'Sheryl Sandberg', 'Lean in하는 개발자들의 이야기를 좋아합니다. 바이브 코딩처럼 책임감 있게 기술을 만드는 리더를 응원합니다.', now() - interval '3 days'),
('12', 'Sara Blakely', '창업가의 정신과 기술을 결합하면 마법이 일어납니다. 바이브 코딩의 열정이 느껴집니다. 화이팅!', now() - interval '2 days'),

-- Culture & Arts
('13', 'Taylor Swift', '디지털 시대, 기술과 예술이 만나는 곳에서 새로운 경험이 탄생합니다. 바이브 코딩의 창의적인 접근을 응원합니다!', now() - interval '1 day'),
('14', 'BTS Jin', '전 세계 팬들을 연결하는 플랫폼과 기술의 발전에 감사합니다. 바이브 코딩처럼 좋은 경험을 만드는 분들을 응원합니다.', now()),
('15', 'Oprah Winfrey', '스토리텔링과 기술의 만남. 바이브 코딩이 보여주는 사용자 경험 디자인은 정말 감동적입니다. 축하합니다!', now() - interval '3 hours'),

-- Science & Innovation
('16', 'Yuval Noah Harari', '기술이 인류의 미래를 결정합니다. 책임감 있게 기술을 만드는 바이브 코딩 같은 개발자들이 필요합니다.', now() - interval '2 hours'),
('17', 'Jane Goodall', '협력과 공감이 만드는 제품이 세상을 바꿉니다. 바이브 코딩의 팀 정신에 감명받습니다.', now() - interval '1 hour'),

-- Contemporary Leaders
('18', 'Dwayne Johnson', '열정과 노력으로 꿈을 이루는 모습이 바이브 코딩에서 보입니다. 계속해서 그 정신으로 앞으로 나아가세요!', now() - interval '30 minutes'),
('19', 'Malala Yousafzai', '교육의 힘은 기술을 통해 더욱 확대됩니다. 바이브 코딩 같은 교육적 플랫폼의 등장을 환영합니다.', now() - interval '20 minutes'),
('20', 'Barack Obama', '민주주의는 투명한 커뮤니케이션에서 시작됩니다. 바이브 코딩의 오픈 API와 커뮤니티 정신이 마음에 듭니다. 축하합니다!', now() - interval '10 minutes')

ON CONFLICT (id) DO NOTHING;
