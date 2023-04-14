// https://leetcode.com/problems/word-ladder/solutions/1211329/rust-bfs-double-ends/
use std::collections::HashSet;

/// @author: Leon
/// https://leetcode.com/problems/word-ladder/
/// Time Complexity:    O(`len_ws` * `len_wd`)
/// Space Complexity:   O(`len_ws` * `len_wd`)
/// Reference:
/// https://leetcode.com/problems/word-ladder/discuss/40711/Two-end-BFS-in-Java-31ms.
impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        let len_ws: usize = word_list.len();
        let mut word_set: HashSet<String> = word_list.into_iter().collect();
        if !word_set.contains(&end_word){
            return 0;
        }
        let mut begin_set: HashSet<String> = {
            let mut set: HashSet<String> = HashSet::with_capacity(len_ws);
            set.insert(begin_word.to_owned());
            set
        };
        let mut end_set: HashSet<String> = {
            let mut set: HashSet<String> = HashSet::with_capacity(len_ws);
            set.insert(end_word.to_owned());
            set
        };
        let mut steps: u16 = 1;
        while !begin_set.is_empty() && !end_set.is_empty(){
            if begin_set.len() > end_set.len(){
                let tmp = begin_set;
                begin_set = end_set;
                end_set = tmp;
            }
            let mut nxt_set: HashSet<String> = HashSet::with_capacity(len_ws);
            for word in begin_set.iter(){
                let len_wd: usize = word.len();
                let mut chs: Vec<char> = word.chars().collect();
                for idx in 0..len_wd{
                    let hold = chs[idx];
                    for ch in 'a'..='z'{
                        chs[idx] = ch;
                        let nxt_wrd: String = chs.iter().collect();
                        if end_set.contains(&nxt_wrd){
                            return 1 + steps as i32;
                        }
                        if !word_set.contains(&nxt_wrd){
                            continue;
                        }
                        nxt_set.insert(nxt_wrd.to_owned());
                        word_set.remove(&nxt_wrd);
                    }
                    chs[idx] = hold;
                }
            }
            begin_set = nxt_set;
            steps += 1;
        }
        return 0;
    }
}