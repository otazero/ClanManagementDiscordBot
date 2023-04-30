/* 特例処置者カラムを追加するためのSQL構文 */
/* source ファイル名(ファイルパス); */
ALTER TABLE t_wt_members ADD COLUMN t_special_treatment BOOLEAN DEFAULT false NOT NULL;