# SELECT * FROM clandb.w_wotb_members;
# SELECT w_user_id, w_is_flag FROM w_wotb_members WHERE w_is_flag = true;
INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at, w_is_flag) 
VALUES (1, "Nigger", 4, "2022-06-19 22:57:30", 1), (2, "BlackTiger", 4, "2022-06-18 22:57:30", 1), (3, "noob", 4, "2022-06-18 22:57:30", 0), (4, "Pro", 4, "2022-06-18 22:57:30", 0)
AS new 
ON DUPLICATE KEY UPDATE w_is_flag = new.w_is_flag;