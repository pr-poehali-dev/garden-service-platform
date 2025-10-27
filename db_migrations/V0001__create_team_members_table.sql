CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO team_members (name, position, photo, order_index) VALUES
('Мелихов Никита', 'Руководитель', 'https://i.pravatar.cc/400?img=12', 1),
('Гвасалия Фредо', 'Главный агроном', 'https://i.pravatar.cc/400?img=33', 2),
('Загудаев Дмитрий', 'Главный бригадир', 'https://i.pravatar.cc/400?img=14', 3),
('Фролов Игорь', 'Ландшафтный дизайнер', 'https://i.pravatar.cc/400?img=8', 4);