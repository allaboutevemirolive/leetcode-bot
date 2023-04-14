// https://leetcode.com/problems/word-ladder-ii/solutions/2425703/rust-idiomatic-short-solution-5ms/
impl Solution {
    fn adjusted(a: &str, b: &str) -> bool {
        a.chars().zip(b.chars()).filter(|(c1, c2)| c1 != c2).count() == 1
    }

    fn generate_output(b_i: usize, ws: &[String], prev: &[(Vec<usize>, i32)]) -> Vec<Vec<String>> {
        let w = &ws[b_i];
        if b_i == ws.len() - 1 {
            return vec![vec![w.clone()]];
        }
        prev[b_i]
            .0
            .iter()
            .flat_map(|&v| Self::generate_output(v, ws, prev))
            .map(|mut v| {
                v.push(w.clone());
                v
            })
            .collect()
    }

    pub fn find_ladders(a: String, b: String, mut ws: Vec<String>) -> Vec<Vec<String>> {
        let b_i = match ws.iter().position(|w| *w == b) {
            Some(i) => i,
            None => return Vec::new(),
        };

        ws.push(a);

        // Previous words from which we can get to this word (only shortest paths)
        // and depth on which we got to this word
        let mut prev = vec![(Vec::new(), -1); ws.len()];
        prev[ws.len() - 1].1 = 0;

        for depth in 0.. {
            let mut advanced = false;
            for (i, w) in ws.iter().enumerate() {
                if prev[i].1 == depth {
                    for (j, w_) in ws.iter().enumerate() {
                        // If we found a word which is adjusted with word with index i
                        // And this word either never have been used, or it have been but on the same depth
                        if (prev[j].1 == -1 || prev[j].1 == depth + 1) && Self::adjusted(w, w_) {
                            advanced = true;
                            prev[j].0.push(i);
                            prev[j].1 = depth + 1;
                        }
                    }
                }
            }
            if !advanced {
                return Vec::new();
            }
            if prev[b_i].1 != -1 {
                break;
            }
        }
        Self::generate_output(b_i, &ws, &prev)
    }
}