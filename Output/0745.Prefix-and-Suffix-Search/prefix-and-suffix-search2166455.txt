// https://leetcode.com/problems/prefix-and-suffix-search/solutions/2166455/rust-trie-not-one-of-my-best-days/
use std::collections::HashMap;

#[derive(Default)]
struct Trie {
    children: Vec<((u8, u8), Trie)>,
    value: Vec<usize>,
}

impl Trie {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn insert(&mut self, word: &String, index: usize) {
        let mut node = self;

        let mut fit = word.as_bytes().iter();
        let mut rit = fit.clone().rev();

        while let (Some(fb), Some(rb)) = (fit.next(), rit.next()) {
            let len = node.children.len();
            let i = match node
                .children
                .iter()
                .enumerate()
                .find(|(_, ((p, s), _))| *fb == *p && *rb == *s)
                .map(|(i, _)| i)
            {
                Some(i) => i,
                None => {
                    node.children.push(((*fb, *rb), Trie::new()));
                    len
                }
            };
            node = &mut node.children[i].1;
        }

        node.value.push(index)
    }

    pub fn lookup(&self, prefix: &String, suffix: &String) -> Vec<usize> {
        let pb = prefix.as_bytes();
        let sb = suffix.as_bytes();
        let pn = pb.len();
        let sn = sb.len();

        let mut rez = vec![];
        let mut stack = vec![(self, 0, sn - 1)];

        while let Some((node, pi, si)) = stack.pop() {
            if pi == pn && si >= sn {
                rez.extend(node.value.iter());
                stack.extend(node.children.iter().map(|(_, n)| (n, pn, sn)));
            } else if si >= sn {
                stack.extend(
                    node.children
                        .iter()
                        .filter(|((p, _), _)| *p == pb[pi])
                        .map(|(_, n)| (n, pi + 1, sn)),
                );
            } else if pi == pn {
                stack.extend(
                    node.children
                        .iter()
                        .filter(|((_, s), _)| *s == sb[si])
                        .map(|(_, n)| (n, pn, si.wrapping_sub(1))),
                );
            } else {
                stack.extend(
                    node.children
                        .iter()
                        .filter(|((p, s), _)| *p == pb[pi] && *s == sb[si])
                        .map(|(_, n)| (n, pi + 1, si.wrapping_sub(1))),
                );
            }
        }

        rez
    }
}

struct WordFilter {
    trie: Trie,
    memo: HashMap<(String, String), i32>,
}

impl WordFilter {
    fn new(words: Vec<String>) -> Self {
        let trie = words
            .iter()
            .enumerate()
            .fold(Trie::new(), |mut trie, (i, s)| {
                trie.insert(s, i);
                trie
            });

        Self {
            trie,
            memo: HashMap::new(),
        }
    }

    fn f(&mut self, prefix: String, suffix: String) -> i32 {
        if let Some(rez) = self.memo.get(&(prefix.clone(), suffix.clone())) {
            return *rez;
        }

        let rez = self
            .trie
            .lookup(&prefix, &suffix)
            .iter()
            .max()
            .map(|r| *r as i32)
            .unwrap_or(-1);

        self.memo.insert((prefix, suffix), rez);
        rez
    }
}