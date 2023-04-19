// https://leetcode.com/problems/word-ladder/solutions/3370235/rust-2-approaches/
impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        fn bfs_approach(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
            use std::collections::{HashMap, HashSet, VecDeque};
            let w_len = begin_word.len();
            let mut adj = HashMap::new();
            for word in word_list {
                for i in 0..w_len {
                    let new_word = format!("{}*{}", &word[0..i], &word[i + 1..]);
                    adj.entry(new_word)
                        .or_insert(vec![])
                        .push(word[0..].to_string());
                }
            }

            let mut visited = HashSet::new();
            let mut queue = VecDeque::new();
            queue.push_back((begin_word, 1));

            while let Some((word, level)) = queue.pop_front() {
                visited.insert(word.clone());
                for i in 0..w_len {
                    let lookup_key = format!("{}*{}", &word[0..i], &word[i + 1..]);
                    let empty = vec![];
                    let n_list = adj.get(&lookup_key).unwrap_or(&empty);
                    for neighbor in n_list {
                        if neighbor == &end_word {
                            return level + 1;
                        }
                        if !visited.contains(neighbor) {
                            queue.push_back((neighbor.clone(), level + 1));
                        }
                    }
                }
            }
            0
        }
        fn bidi_search_bfs_approach(
            begin_word: String,
            end_word: String,
            word_list: Vec<String>,
        ) -> i32 {
            use std::collections::{HashMap, VecDeque};
            fn visit_node(
                queue: &mut VecDeque<(String, i32)>,
                visited: &mut HashMap<String, i32>,
                visited_other: &mut HashMap<String, i32>,
                adj: &HashMap<String, Vec<String>>,
            ) -> i32 {
                for _ in 0..queue.len() {
                    let (word, level) = queue.pop_front().unwrap();
                    for i in 0..word.len() {
                        let lookup_key = format!("{}*{}", &word[0..i], &word[i + 1..]);
                        let empty_vec = vec![];
                        let n_vec = adj.get(&lookup_key).unwrap_or(&empty_vec);
                        for neighbor in n_vec {
                            if visited_other.contains_key(neighbor) {
                                return level + visited_other[neighbor];
                            }

                            if !visited.contains_key(neighbor) {
                                visited.insert(neighbor.clone(), level + 1);
                                queue.push_back((neighbor.clone(), level + 1));
                            }
                        }
                    }
                }
                -1
            }
            if !word_list.contains(&end_word) {
                return 0;
            }
            let w_len = begin_word.len();
            let mut adj = HashMap::new();
            for word in word_list {
                for i in 0..w_len {
                    let new_word = format!("{}*{}", &word[0..i], &word[i + 1..]);
                    adj.entry(new_word)
                        .or_insert(vec![])
                        .push(word[0..].to_string());
                }
            }

            let mut visit_begin = HashMap::new();
            visit_begin.insert(begin_word.clone(), 1);
            let mut visit_end = HashMap::new();
            visit_end.insert(end_word.clone(), 1);

            let mut start_queue = VecDeque::new();
            start_queue.push_back((begin_word, 1));
            let mut end_queue = VecDeque::new();
            end_queue.push_back((end_word, 1));

            while !start_queue.is_empty() && !end_queue.is_empty() {
                let ans = if start_queue.len() <= end_queue.len() {
                    visit_node(&mut start_queue, &mut visit_begin, &mut visit_end, &adj)
                } else {
                    visit_node(&mut end_queue, &mut visit_end, &mut visit_begin, &adj)
                };
                if ans > -1 {
                    return ans;
                }
            }
            0
        }
        bidi_search_bfs_approach(begin_word, end_word, word_list)
    }
}