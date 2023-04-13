// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/1839375/rust-3ms-code/
pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        if words.len() == 0 {
            return vec![];
        }
        let (word_len, window_len) = (words[0].len(), words[0].len() * words.len());
        if s.len() < window_len {
            return vec![];
        }

        let mut result = vec![];
        let mut map: HashMap<_, _> = HashMap::from_iter(words.iter().map(|s| (s as &str, (0, 0))));
        for word in &words {
            map.get_mut(&word as &str).unwrap().1 += 1;
        }
        for i in 0..(s.len() + 1 - window_len).min(word_len) {
            let mut start = i;
            let mut end = start + window_len;
            'out_loop: while end <= s.len() {
                for j in (start..end).step_by(word_len) {
                    let cur = &s[j..j + word_len];
                    match map.entry(&cur) {
                        Entry::Occupied(mut entry) => {
                            let (count, target) = entry.get_mut();
                            if count == target {
                                for k in (end - window_len..j).step_by(word_len) {
                                    let word = &s[k..k + word_len];
                                    if cur != word {
                                        map.get_mut(&word).unwrap().0 -= 1;
                                    } else {
                                        start = j + word_len;
                                        end = k + window_len + word_len;
                                        continue 'out_loop;
                                    }
                                }
                            } else {
                                *count += 1;
                            }
                        }
                        Entry::Vacant(_) => {
                            start = j + word_len;
                            end = start + window_len;
                            map.values_mut().for_each(|v| v.0 = 0);
                            continue 'out_loop;
                        }
                    }
                }
                let index = end - window_len;
                result.push(index as i32);
                map.get_mut(&&s[index..index + word_len]).unwrap().0 -= 1;
                start = end;
                end += word_len;
            }
            map.values_mut().for_each(|v| v.0 = 0);
        }
        result
    }