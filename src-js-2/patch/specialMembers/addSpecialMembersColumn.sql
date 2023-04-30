/* 特例処置者カラムを追加するためのSQL構文 */
ALTER TABLE t_wt_members ADD COLUMN t_special_treatment BOOLEAN DEFAULT false NOT NULL;