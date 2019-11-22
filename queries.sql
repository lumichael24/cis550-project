--QUERY 1--
WITH P1_ID AS (
	SELECT PM.player_id
	FROM Player_Map PM 
	WHERE PM.name = "Lebron James"
), P2_ID AS (
	SELECT PM.player_id
	FROM Player_Map PM 
	WHERE PM.name = "Kobe Bryant"
), P1_GAMES AS (
	SELECT Game_id, person_id, Abbreviation, Outcome, Points, Rebounds, Assists
	FROM Player_Boxscores PBS
	WHERE person_id in (SELECT player_id
						FROM P1_ID)
), P2_GAMES AS (
	SELECT Game_id, person_id, Abbreviation, Outcome, Points, Rebounds, Assists
	FROM Player_Boxscores PBS
	WHERE person_id in (SELECT player_id
						FROM P2_ID)
), GAMES_INTERSECTION AS (
	SELECT person_id, Outcome, Points, Rebounds, Assists
	FROM P1_GAMES P1G JOIN P2_GAMES P2G ON P1G.Game_id = P2G.Game_id
	WHERE P1G.Abbreviation <> P2G.Abbreviation
)
SELECT GI.AVG(GI.Points), AVG(GI.Rebounds), AVG(GI.Assists)
FROM GAMES_INTERSECTION GI 
GROUP BY GI.person_id, Outcome 

--QUERY 2--
WITH TOTAL_POINTS_FOR AS (
	SELECT PB.Team_id, PB.Season, SUM(PB.Points) AS points_for
	FROM Player_Boxscores PB
	GROUP BY PB.Team_id, PB.Season
), TOTAL_POINTS_AGAINST AS (
	SELECT PB.vs_team_id, PB.Season, SUM(PB.Points) AS points_against
	FROM Player_Boxscores PB
	GROUP BY PB.vs_team_id, PB.Season
), POINT_DIFF AS (
	SELECT TPF.Team_id, (TPF.points_for - TPF.points_against) / 82.0 AS point_diff
	FROM TOTAL_POINTS_FOR TPF JOIN TOTAL_POINTS_AGAINST TPA ON TPF.Team_id = TPA.vs_team_id AND TPF.Season = TPA.Season
)
SELECT tm.City, tm.Team, tm.Conference, pd.point_diff
FROM POINT_DIFF pd JOIN Team_Map tm ON pd.Team_id = tm.Team_ID
WHERE ROWNUM <= 10
ORDER BY pd.point_diff DESC

--QUERY 3--
WITH teamOneId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Team = "Atlanta Hawks"
), teamTwoId AS (
	SELECT Team_ID
	FROM Team_Map tm 
	WHERE tm.Team = "Boston Celtics"
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
(SELECT ato.Player_Name, ato.pm, tm.name
FROM aggTeamOne ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id 
WHERE ROWNUM <= 5)
UNION
((SELECT ato.Player_Name, ato.pm, tm.name
FROM aggTeamTwo ato JOIN Team_Map tm ON ato.Team_id = tm.Team_id 
WHERE ROWNUM <= 5))






