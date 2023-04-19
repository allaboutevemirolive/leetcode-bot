// https://leetcode.com/problems/minimum-window-substring/solutions/233794/accepted-but-slowest-rust-implementation/
use std::collections::HashSet;
use std::collections::HashMap;
use std::str::FromStr;

impl Solution {
    pub fn min_window(s: String, t: String) -> String {

        // Make a map with the counts of the required chars.
        let mut req_letters: HashMap<char, i32> = HashMap::new();
        for c in t.chars() {
            match req_letters.get(&c) {
                Some(v)  => {
                    req_letters.insert(c, *v + 1);
                },
                None => {
                    req_letters.insert(c, 1);
                },
            }
        }

        // One set keeps the counts, the other is kept coherent with keys membership
        // this is so that we can use the "is_subset" property of the set, while keeping counts.
        // Best way to accomplish this would be to make a struct+impl instead of duplication.
        let mut present_letters_map : HashMap<char, i32> = HashMap::new();

        let mut found_match = false;
        let mut min_string = String::from(s.clone());

        // now start the sliding window protocol on a vec
        let vec_s: Vec<char> = s.chars().collect();

        let mut s_i : usize = 0;
        for (e_i, e_c) in s.chars().enumerate() {
            //println!("Eating {} at the head, min_string is {}, found_match: {}, window {}-{}", e_c, min_string, found_match, s_i, e_i);

            // Push the new char (if in req_letters).
            // If exists increment, if not add to set and insert as count 1
            if req_letters.contains_key(&e_c) {
                match present_letters_map.get(&e_c) {
                    Some(v) => {
                        present_letters_map.insert(e_c, v+1);
                    }
                    None => {
                        present_letters_map.insert(e_c, 1);
                    }
                }
            }

            // while we have a superset (or identical) we can try to move the tail up
            //println!("{:?} {:?}", present_letters_map, req_letters);

            while Solution::hash_chars_at_least(&present_letters_map, &req_letters) {
                found_match = true;
                // we know that we're currently a subset so if we're smaller we should assign to min_string with copy
                if e_i - s_i < min_string.len() {
                    // eat my heart out utf-8. (also: slices are non inclusive.)
                    if let Ok(str_copy) = String::from_str(&s[s_i..e_i+1]) {
                        min_string = str_copy;
                    }
                }

                // move up the tail if it would still be a subset, if not, break
                let tail_char = vec_s[s_i];
                match present_letters_map.get(&tail_char) {
                    Some(v) => {
                        // removing this char would break the subset, remove it then move the head forward.
                        if *v <= 1 {
                            break;
                        }
                        // moving past this char is fine
                        else {
                            s_i += 1;
                            present_letters_map.insert(tail_char, *v-1);
                        }
                    }
                    None => {
                        s_i += 1;
                    }
                }
            }
        }

        // Only return min_string if we have a match as we initialized it to input string
        if found_match == false {
            String::from("")
        } else {
            min_string
        }
    }

    // Does every key exist and have at least as many in value?
    pub fn hash_chars_at_least(hash_cmp: &HashMap<char, i32>, hash_bound: &HashMap<char, i32>) -> bool {
        for k in hash_bound.keys() {
            match hash_cmp.get(k) {
                // has the key
                Some(v) => {
                    if v >= hash_bound.get(k).unwrap() {
                        continue;
                    } else {
                        return false;
                    }
                }
                // missing a key
                None => {
                    return false;
                }
            }
        }
        true
    }
}