// https://leetcode.com/problems/word-ladder/solutions/937716/rust-bfs-solution/
impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        use std::collections::HashSet;
        let mut words = HashSet::new();

        for word in word_list {
            words.insert(word);
        }
        if !words.contains(&end_word) {
            return 0;
        }

        let mut distance: i32 = 1;
        let mut q = vec![begin_word.clone()];
        let mut reached = HashSet::new();
        reached.insert(begin_word);
        let letters = (b'a'..=b'z').map(char::from).collect::<Vec<_>>();
        while q.len() > 0 {
            let q_size = q.len();
            for _i in 0..q_size {
                let curr_word = q.remove(0);
                for j in 0..curr_word.len() {
                    for k in &letters {
                        let new_word = (&curr_word[0..j]).to_string() + &(k.to_string()) + &curr_word[j+1..];
                        if new_word == end_word {
                            return distance+1;
                        }

                        if !words.contains(&new_word) || new_word == curr_word {
                            continue;
                        }

                        if !reached.contains(&new_word) {
                            q.push(new_word.clone());
                            reached.insert(new_word);
                        }
                    }
                }
            }
            distance += 1;
        }
        0
    }
}