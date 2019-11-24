-- Colleges that produce the most NBA players --
SELECT N.college, COUNT(*) as numOfPlayers
FROM NBA N
WHERE N.college <> 'No College'
GROUP BY N.college
ORDER BY COUNT(*) DESC;

-- Colleges that produce the most NBA players by position --
WITH TEMP_GUARDS AS (
    SELECT N.college, N.pos, count(*) as numOfPlayers 
    FROM NBA N
    WHERE N.college <> 'No College' AND N.pos = 'G'
    GROUP BY N.college, N.pos
    ORDER BY COUNT(*) DESC
), TEMP_FORWARDS AS (
    SELECT N.college, N.pos, count(*) as numOfPlayers 
    FROM NBA N
    WHERE N.college <> 'No College' AND N.pos = 'F'
    GROUP BY N.college, N.pos
    ORDER BY COUNT(*) DESC
), TEMP_CENTERS AS (
    SELECT N.college, N.pos, count(*) as numOfPlayers 
    FROM NBA N
    WHERE N.college <> 'No College' AND N.pos = 'C'
    GROUP BY N.college, N.pos
    ORDER BY COUNT(*) DESC
), TOTAL AS (
    (SELECT *
    FROM TEMP_GUARDS
	LIMIT 10)
    UNION
    (SELECT *
    FROM TEMP_FORWARDS
    LIMIT 10)
    UNION
    (SELECT *
    FROM TEMP_CENTERS
    LIMIT 10)
)
SELECT *
FROM TOTAL T
ORDER BY T.pos DESC, T.numOfPlayers DESC;

-- Underpeformers (Busts)
WITH NBAC as (
    SELECT * 
    FROM NBA INNER JOIN College ON NBA.name=College.name and NBA.College = College.College
),
College_points_bust as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.PTS) as College_points_percentile
    FROM College 
),
NBA_points_bust as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.PTS) as NBA_points_percentile 
    FROM NBA
), 
points_bust as (
    select NPB.name, College_points_percentile, NBA_points_percentile
    from College_points_bust CPB join NBA_points_bust NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_points_percentile >= .8 AND NBA_points_percentile <=.20 AND NPB.G > 20
),
College_assists_bust as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.AST) as College_assists_percentile
    FROM College 
),
NBA_assists_bust as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.AST) as NBA_assists_percentile 
    FROM NBA
), 
assists_bust as (
    select NPB.name, College_assists_percentile, NBA_assists_percentile
    from College_assists_bust CPB join NBA_assists_bust NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_assists_percentile >= .8 AND NBA_assists_percentile <=.20 AND NPB.G > 20
),
College_rebounds_bust as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.TRB) as College_rebounds_percentile
    FROM College 
),
NBA_rebounds_bust as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.TRB) as NBA_rebounds_percentile 
    FROM NBA
), 
rebounds_bust as (
    select NPB.name, College_rebounds_percentile, NBA_rebounds_percentile
    from College_rebounds_bust CPB join NBA_rebounds_bust NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_rebounds_percentile >= .8 AND NBA_rebounds_percentile <=.20 AND NPB.G > 20
) 
select name
from points_bust
union
select name
from assists_bust
union
select name
from rebounds_bust;

-- Overperformers (Sleepers) --
WITH NBAC as (
    SELECT * 
    FROM NBA INNER JOIN College ON NBA.name=College.name and NBA.College = College.College
), College_points_sleeper as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.PTS) as College_points_percentile
    FROM College 
), NBA_points_sleeper as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.PTS) as NBA_points_percentile 
    FROM NBA
), points_sleeper as (
    select NPB.name, College_points_percentile, NBA_points_percentile
    from College_points_sleeper CPB join NBA_points_sleeper NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_points_percentile <= .2 AND NBA_points_percentile >=.80 AND NPB.G > 20
), College_assists_sleeper as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.AST) as College_assists_percentile
    FROM College 
), NBA_assists_sleeper as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.AST) as NBA_assists_percentile 
    FROM NBA
), assists_sleeper as (
    select NPB.name, College_assists_percentile, NBA_assists_percentile
    from College_assists_sleeper CPB join NBA_assists_sleeper NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_assists_percentile <= .2 AND NBA_assists_percentile >=.80 AND NPB.G > 20
), College_rebounds_sleeper as (
    SELECT College.name, College.College,  PERCENT_RANK() OVER(ORDER BY College.TRB) as College_rebounds_percentile
    FROM College 
), NBA_rebounds_sleeper as (
    SELECT NBA.name, NBA.College, NBA.G, PERCENT_RANK() OVER(ORDER BY NBA.TRB) as NBA_rebounds_percentile 
    FROM NBA
), rebounds_sleeper as (
    select NPB.name, College_rebounds_percentile, NBA_rebounds_percentile
    from College_rebounds_sleeper CPB join NBA_rebounds_sleeper NPB on CPB.name = NPB.name and CPB.College = NPB.College
    WHERE College_rebounds_percentile <= .2 AND NBA_rebounds_percentile >=.80 AND NPB.G > 20
) 
select name
from points_sleeper
union
select name
from assists_sleeper
union
select name
from rebounds_sleeper;

-- Displays Head to Head Matchups --
WITH P1_ID AS (
	SELECT PM.player_id
	FROM Player_Map PM 
	WHERE PM.name = "Lebron James"
), P2_ID AS (
	SELECT PM.player_id
	FROM Player_Map PM 
	WHERE PM.name = "Kobe Bryant"
), P1_GAMES AS (
	SELECT Game_id, person_id, Player_Name, Abbreviation, Outcome, Points, Rebounds, Assists
	FROM Player_Boxscores PBS
	WHERE person_id in (SELECT player_id
						FROM P1_ID)
), P2_GAMES AS (
	SELECT Game_id, person_id, Player_Name, Abbreviation, Outcome, Points, Rebounds, Assists
	FROM Player_Boxscores PBS
	WHERE person_id in (SELECT player_id
						FROM P2_ID)
), GAMES_INTERSECTION_P1 AS (
	SELECT P1G.person_id, P1G.Player_Name, P1G.Outcome, P1G.Points, P1G.Rebounds, P1G.Assists
	FROM P1_GAMES P1G JOIN P2_GAMES P2G ON P1G.Game_id = P2G.Game_id
	WHERE P1G.Abbreviation <> P2G.Abbreviation
), GAMES_INTERSECTION_P2 AS (
	SELECT P2G.person_id, P2G.Player_Name, P2G.Outcome, P2G.Points, P2G.Rebounds, P2G.Assists
	FROM P1_GAMES P1G JOIN P2_GAMES P2G ON P1G.Game_id = P2G.Game_id
	WHERE P1G.Abbreviation <> P2G.Abbreviation
) 
(SELECT GIP1.Player_Name, AVG(GIP1.Points), AVG(GIP1.Rebounds), AVG(GIP1.Assists), GIP1.Outcome, COUNT(*) as Num
FROM GAMES_INTERSECTION_P1 GIP1
GROUP BY GIP1.Outcome)
UNION
(SELECT GIP2.Player_Name, AVG(GIP2.Points), AVG(GIP2.Rebounds), AVG(GIP2.Assists), GIP2.Outcome, COUNT(*) as Num
FROM GAMES_INTERSECTION_P2 GIP2
GROUP BY GIP2.Outcome)


-- Point Differential per Season --
WITH TOTAL_POINTS_FOR AS (
	SELECT PB.Team_id, PB.Season, SUM(PB.Points) AS points_for
	FROM Player_Boxscores PB
	GROUP BY PB.Team_id, PB.Season
), TOTAL_POINTS_AGAINST AS (
	SELECT PB.vs_team_id, PB.Season, SUM(PB.Points) AS points_against
	FROM Player_Boxscores PB
	GROUP BY PB.vs_team_id, PB.Season
), POINT_DIFF AS (
	SELECT TPF.Team_id, TPF.Season, (TPF.points_for - TPA.points_against) / 82.0 AS point_diff
	FROM TOTAL_POINTS_FOR TPF JOIN TOTAL_POINTS_AGAINST TPA ON TPF.Team_id = TPA.vs_team_id AND TPF.Season = TPA.Season
)
SELECT tm.Name, tm.Conference, pd.Season, pd.point_diff
FROM POINT_DIFF pd JOIN Team_Map tm ON pd.Team_id = tm.Team_ID
ORDER BY pd.point_diff DESC
LIMIT 10;


-- Team Head to Head Matchups --
WITH teamOneId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Name = "Atlanta Hawks"
), teamTwoId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Name = "Boston Celtics"
), teamOnePlayers AS (
	SELECT Person_id, Player_Name, Team_Id, Plus_Minus
	FROM Player_Boxscores pb
	WHERE pb.Team_id IN (SELECT Team_ID FROM teamOneId) AND pb.vs_team_id IN 
	(SELECT Team_Id FROM teamTwoId)
), teamTwoPlayers AS (
	SELECT Person_id, Player_Name, Team_Id, Plus_Minus
	FROM Player_Boxscores pb
	WHERE pb.Team_id IN (SELECT Team_ID FROM teamTwoId) AND pb.vs_team_id IN 
	(SELECT Team_Id FROM teamOneId)
), aggTeamOne AS (
	SELECT top.Person_id, top.Player_Name, top.Team_id, AVG(top.Plus_Minus) AS PM
	FROM teamOnePlayers top
	GROUP BY top.person_id, top.Player_Name, top.Team_id
	ORDER BY AVG(top.Plus_Minus) DESC
), aggTeamTwo AS (
	SELECT top.Person_id, top.Player_Name, top.Team_id, AVG(top.Plus_Minus) AS PM
	FROM teamTwoPlayers top
	GROUP BY top.person_id, top.Player_Name, top.Team_id
	ORDER BY AVG(top.Plus_Minus) DESC
)
(SELECT ato.Player_Name, ato.pm as PlusMinus, tm.name as TeamName
FROM aggTeamOne ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id 
LIMIT 5)
UNION
(SELECT ato.Player_Name, ato.pm as PlusMinus, tm.name
FROM aggTeamTwo ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id 
LIMIT 5);

-- Team Head to Head Record --
WITH teamOneId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Name = "Cleveland Cavaliers"
), teamTwoId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Name = "Milwaukee Bucks"
), teamOneWins AS (
	SELECT DISTINCT pb.game_id, pb.Team_id, pb.Outcome
    FROM Player_Boxscores pb
    WHERE pb.vs_team_ID IN (SELECT * FROM teamTwoId) AND pb.Team_id 
    IN (SELECT * FROM teamOneId)
), teamTwoWins AS (
	SELECT DISTINCT pb.game_id, pb.Team_id, pb.Outcome
    FROM Player_Boxscores pb
    WHERE pb.vs_team_ID IN (SELECT * FROM teamOneId) AND pb.Team_id 
    IN (SELECT * FROM teamTwoId)
), aggTeamOne AS (
	SELECT tow.Team_id, tow.Outcome, COUNT(*) as num
	FROM teamOneWins tow
	GROUP BY tow.Team_id, tow.Outcome 
), aggTeamTwo AS (
	SELECT ttw.Team_id, ttw.Outcome, COUNT(*) as num
	FROM teamTwoWins ttw
	GROUP BY ttw.Team_id, ttw.Outcome 
)
(SELECT *
FROM aggTeamOne ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id)
UNION
(SELECT *
FROM aggTeamTwo ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id);


