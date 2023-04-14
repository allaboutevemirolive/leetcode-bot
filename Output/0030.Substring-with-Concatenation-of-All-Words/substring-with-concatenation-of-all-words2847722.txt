// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/2847722/rust-map-sliding-window-approaches/
pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
    fn find_substring_map_scan(s: String, words: Vec<String>) -> Vec<i32> {
        use std::collections::hash_map::Entry;
        use std::collections::HashMap;

        let word_size = words[0].len();
        let substring_size = words[0].len() * words.len();

        let words = words.iter().fold(HashMap::new(), |mut acc, v| {
            if let Entry::Vacant(e) = acc.entry(v.as_str()) {
                e.insert(1);
            } else {
                *acc.get_mut(v.as_str()).unwrap() += 1;
            }
            acc
        });

        fn check(
            s: &str,
            mut words: HashMap<&str, i32>,
            i: usize,
            word_size: usize,
            substring_size: usize,
        ) -> bool {
            for j in (i..substring_size + i).step_by(word_size) {
                let w = &s[j..j + word_size];
                if words.contains_key(w) {
                    let val = words.get_mut(w).unwrap();
                    *val -= 1;
                    if *val < 0 {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            true
        }

        let mut res = vec![];
        for i in 0..s.len() - substring_size + 1 {
            if check(&s, words.clone(), i, word_size, substring_size) {
                res.push(i as i32)
            }
        }

        res
    }

    fn find_substring_sliding_window(s: String, words: Vec<String>) -> Vec<i32> {
        use std::collections::hash_map::Entry;
        use std::collections::HashMap;

        let word_length = words[0].len();
        let substring_size = words[0].len() * words.len();

        if word_length > s.len() {
            return vec![];
        }

        let words_count = words.iter().fold(HashMap::new(), |mut acc, v| {
            if let Entry::Vacant(e) = acc.entry(v.as_str()) {
                e.insert(1);
            } else {
                *acc.get_mut(v.as_str()).unwrap() += 1;
            }
            acc
        });

        fn sliding_window(
            mut left: usize,
            s: &str,
            substring_size: usize,
            words_count: &HashMap<&str, i32>,
            word_length: usize,
            words_length: usize,
            res: &mut Vec<i32>,
        ) {
            let mut words_found = HashMap::new();
            let mut words_used = 0;
            let mut excess_word = false;

            for right in (left..=s.len() - word_length).step_by(word_length) {
                let sub = &s[right..right + word_length];

                if !words_count.contains_key(sub) {
                    words_found.clear();
                    words_used = 0;
                    excess_word = false;
                    left = right + word_length;
                } else {
                    // If we reached max window size or have an excess word
                    while right - left == substring_size || excess_word {
                        let leftmost_word = &s[left..left + word_length];
                        left += word_length;

                        let wf = words_found.get_mut(leftmost_word).unwrap();
                        *wf -= 1;

                        if *wf >= *words_count.get(leftmost_word).unwrap_or(&0) {
                            // This word was an excess word
                            excess_word = false;
                        } else {
                            // Otherwise we actually needed it
                            words_used -= 1;
                        }
                    }

                    // Keep track of how many times this word occurs in the window
                    if let Entry::Vacant(e) = words_found.entry(sub) {
                        e.insert(1);
                    } else {
                        *words_found.get_mut(sub).unwrap() += 1;
                    }

                    if words_found.get(sub) <= words_count.get(sub) {
                        words_used += 1;
                    } else {
                        // Found too many instances already
                        excess_word = true;
                    }

                    if words_used == words_length && !excess_word {
                        res.push(left as i32);
                    }
                }
            }
        }

        let mut res = vec![];
        for left in 0..word_length {
            sliding_window(
                left,
                &s,
                substring_size,
                &words_count,
                word_length,
                words.len(),
                &mut res,
            );
        }
        res
    }

    find_substring_sliding_window(s, words)
}