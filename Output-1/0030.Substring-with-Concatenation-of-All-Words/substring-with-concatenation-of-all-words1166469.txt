// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/1166469/straightforward-rust-solution-with-20ms-2-4m/
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        let mut subs = vec![];
        if let Some(first) = words.first() {
            let c = words.len();
            let n = first.len();
            if s.len() < n * c {
                return subs;
            }

            let mut map = std::collections::HashMap::with_capacity(c);
            for w in words {
                let entry = map.entry(w).or_insert((s.len(), 0, 0)); // (see_from_index, seen, total)
                *entry = (entry.0, entry.1, entry.2 + 1);
            }
            'outer: for i in 0..s.len() - n * c + 1 {
                for j in 0..c {
                    let word = &s[i + j * n..i + (j + 1) * n];
                    if let Some(entry) = map.get_mut(word) {
                        if entry.0 != i {
                            *entry = (i, 1, entry.2);
                        } else if entry.1 + 1 <= entry.2 {
                            *entry = (i, entry.1 + 1, entry.2);
                        } else {
                            continue 'outer;
                        }
                    } else {
                        continue 'outer;
                    }
                }
                subs.push(i as i32);
            }
        }
        subs
    }