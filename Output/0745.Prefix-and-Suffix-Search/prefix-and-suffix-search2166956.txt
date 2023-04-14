// https://leetcode.com/problems/prefix-and-suffix-search/solutions/2166956/rust-simple-iterator-based-trie-solution/
use std::collections::HashMap;

struct TrieNode {
    index: i32,
    children: HashMap<u8, TrieNode>,
}

impl TrieNode {
    fn new(index: i32) -> Self {
        Self { index, children: HashMap::default() }
    }
}

pub struct WordFilter {
    root: TrieNode,
}

impl WordFilter {
    pub fn new(words: Vec<String>) -> Self {
        let mut instance = Self { root: TrieNode::new(0) };
        words
            .into_iter()
            .enumerate()
            .for_each(|(index, word)| instance.add_word(&word, index as i32));
        instance
    }

    fn add_word(&mut self, word: &str, index: i32) {
        for i in 0..word.len() + 1 {
            let word_iter = word.bytes().rev().take(i).rev()
				.chain(std::iter::once(0u8))
				.chain(word.bytes());
            self.get_or_create_node(word_iter, index).index = index;
        }
    }

    fn get_or_create_node(&mut self, path: impl Iterator<Item = u8>, index: i32) -> &mut TrieNode {
        path.fold(&mut self.root, |root, ch| {
            root.index = index;
            root.children.entry(ch).or_insert_with(|| TrieNode::new(index))
        })
    }

    fn traverse(&self, mut path: impl Iterator<Item = u8>) -> Option<&TrieNode> {
        path.try_fold(&self.root, |root, ch| root.children.get(&ch))
    }

    pub fn f(&self, prefix: String, suffix: String) -> i32 {
        let word_iter = suffix.bytes().chain(std::iter::once(0u8)).chain(prefix.bytes());
        match self.traverse(word_iter) {
            None => -1,
            Some(node) => node.index,
        }
    }
}