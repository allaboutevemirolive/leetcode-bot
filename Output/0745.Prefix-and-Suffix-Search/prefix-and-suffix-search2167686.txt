// https://leetcode.com/problems/prefix-and-suffix-search/solutions/2167686/rust-solution-trie-set/
use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Default, Debug)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    index: HashSet<usize>,
}

struct WordFilter {
    prefix_root: TrieNode,
    suffix_root: TrieNode,
}

impl TrieNode {
    pub fn insert(&mut self, word: &str, index: usize) {
        let mut node = self;

        for ch in word.chars() {
            node = node.children.entry(ch).or_insert(TrieNode::default());
            node.index.insert(index);
        }
    }

    pub fn find(&mut self, word: &str) -> Option<HashSet<usize>> {
        let mut node = self;
        for ch in word.chars() {
            if let Some(n) = node.children.get_mut(&ch) {
                node = n;
            } else {
                return None;
            }
        }
        Some(node.index.clone())
    }
}

/**
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl WordFilter {
    fn new(words: Vec<String>) -> Self {
        // remove duplicate elements, keep the last index of the same value
        let unique_val: HashMap<String, usize> = words
            .iter()
            .enumerate()
            .map(|(i, w)| (w.to_owned(), i))
            .collect();

        let mut prefix_root = TrieNode::default();
        let mut suffix_root = TrieNode::default();

        for (w, i) in unique_val.iter() {
            prefix_root.insert(&w.as_str(), i.to_owned());
            suffix_root.insert(&w.chars().rev().collect::<String>(), i.to_owned());
        }

        Self {
            prefix_root,
            suffix_root,
        }
    }

    fn f(&mut self, prefix: String, suffix: String) -> i32 {
        let prefix_res = self.prefix_root.find(&prefix);
        if prefix_res.is_none() {
            return -1;
        }
        let p_res = match prefix_res {
            Some(res) => res,
            None => return -1,
        };
        let suffix_res = self
            .suffix_root
            .find(&suffix.chars().rev().collect::<String>());
        let s_res = match suffix_res {
            Some(res) => res,
            None => return -1,
        };

        let res = p_res.intersection(&s_res);
        if let Some(i) = res.max() {
            *i as i32
        } else {
            -1
        }
    }
}

