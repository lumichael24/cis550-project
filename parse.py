import pandas as pd

def parse_Player_Boxscores():
	df = pd.read_csv("Player_Boxscores.csv", header=0)

	with open("out.txt", "w") as f:
		for index, row in df.iterrows():
			f.write("INSERT INTO cis550proj.Player_Boxscores(Game_id, Season, Season_Type, Game_No, Playoff_Rd, Playoff_Rd_Game_No, Date, Person_id, Player_Name, Team_id, Abbreviation, Location, Outcome, vs_team_id, Min_Played, Sec_Played, Points, Rebounds, Assists, Plus_Minus) ")
			str = "VALUES({}, {}, \"{}\", {}, {}, {}, {}, {}, \"{}\", {}, \"{}\", \"{}\", \"{}\", {}, {}, {}, {}, {}, {}, {})".format(row["Game_id"], row["Season"], row["Season_Type"], row["Game_No"], row["Playoff_Rd"], row["Playoff_Rd_Game_No"], row["Date"], row["Person_id"], row["Player_Name"], row["Team_id"], row["Abbreviation"], row["Location"], row["Outcome"], row["vs_team_id"], row["Min_Played"], row["Sec_Played"], row["Points"], row["Rebounds"], row["Assists"], row["Plus_Minus"])
			str = str + ";"
			f.write(str)
			f.write('\n')
	f.close()

def parse_college_data():
	df = pd.read_csv("kevin_college_v32.csv", header=0)

	with open("outcollege.txt", "w") as f:
		for index, row in df.iterrows():
			f.write("INSERT INTO cis550proj.College(Name, College, Years_Played, G, GS, MP, FG, FGA, FGP, 2P, 2PA, 2PP, 3P, 3PA, 3PP, FT, FTA, FTP, ORB, DRB, TRB, AST, STL, BLK, TOV, PF, PTS, SOS) ")
			str = "VALUES(\"{}\", \"{}\", \"{}\", {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(row["Name"], row["College"], row["Years_Played"], row["G"], row["GS"], row["MP"], row["FG"], row["FGA"], row["FGP"], row["2P"], row["2PA"], row["2PP"], row["3P"], row["3PA"], row["3PP"], row["FT"], row["FTA"], row["FTP"], row["ORB"], row["DRB"], row["TRB"], row["AST"], row["STL"], row["BLK"], row["TOV"], row["PF"], row["PTS"], row["SOS"])
			str = str + ";"
			f.write(str)
			f.write('\n')
	f.close()

def parse_nba_data():
	df = pd.read_csv("nba.csv", header=0)
	with open("outnba.txt", "w") as f:
		for index, row in df.iterrows():
			f.write("INSERT INTO cis550proj.NBA(Name, Start, Finish, Pos, Ht, Wt, Birth_Date, College, G, GS, MP, FG, FGA, FGP, 2P, 2PA, 2PP, 3P, 3PA, 3PP, FT, FTA, FTP, ORB, DRB, TRB, AST, STL, BLK, TOV, PF, PTS) ")
			str = "VALUES(\"{}\", \"{}\", \"{}\", \"{}\", {}, {}, \"{}\", \"{}\", {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(row["Name"], row["Start"], row["Finish"], row["Pos"], row["Ht"], row["Wt"], row["Birth_Date"], row["College"], row["G"], row["GS"], row["MP"], row["FG"], row["FGA"], row["FGP"], row["2P"], row["2PA"], row["2PP"], row["3P"], row["3PA"], row["3PP"], row["FT"], row["FTA"], row["FTP"], row["ORB"], row["DRB"], row["TRB"], row["AST"], row["STL"], row["BLK"], row["TOV"], row["PF"], row["PTS"])
			str = str + ";"
			f.write(str)
			f.write('\n')
	f.close()
#parse_college_data()
parse_nba_data()
