CREATE TABLE matches (
	id INT NOT NULL,
	season INT NOT NULL,
	city TEXT,
	date DATE NOT NULL,
	team1 TEXT NOT NULL,
	team2 TEXT NOT NULL,
	toss_winner TEXT NOT NULL,
	toss_decision TEXT NOT NULL,
	result TEXT NOT NULL,
	dl_applied INT NOT NULL,
	winner TEXT,
	win_by_runs INT NOT NULL,
	win_by_wickets INT NOT NULL,
	player_of_match TEXT,
	venue TEXT NOT NULL,
	umpire1 TEXT,
	umpire2 TEXT,
	umpire3 TEXT
);

CREATE TABLE deliveries (
	match_id INT NOT NULL,
	inning INT NOT NULL,
	batting_team TEXT NOT NULL,
	bowling_team TEXT NOT NULL,
	over INT NOT NULL,
	ball INT NOT NULL,
	batsman TEXT NOT NULL,
	non_striker TEXT NOT NULL,
	bowler TEXT NOT NULL,
	is_super_over INT NOT NULL,
	wide_runs INT NOT NULL,
	bye_runs INT NOT NULL,
	legbye_runs INT NOT NULL,
	noball_runs INT NOT NULL,
	penalty_runs INT NOT NULL,
	batsman_runs INT NOT NULL,
	extra_runs INT NOT NULL,
	total_runs INT NOT NULL,
	player_dismissed TEXT,
	dismissal_kind TEXT,
	fielder TEXT
);

CREATE TABLE logs (
  user_id TEXT PRIMARY KEY,
  timestamp DATE NOT NULL,
  query_text TEXT,
  query_response TEXT,
  is_error_occured BOOLEAN
);
