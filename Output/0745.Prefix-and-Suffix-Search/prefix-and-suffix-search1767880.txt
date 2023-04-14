// https://leetcode.com/problems/prefix-and-suffix-search/solutions/1767880/rust-three-solutions/
use std::collections::HashMap;
use std::num::NonZeroUsize;

const NO_SUCH_WORD: i32 = -1;

#[derive(Default)]
struct Node {
    values: HashMap<u8, Node>,
    index: Option<NonZeroUsize>,
}

impl Node {
    pub fn insert(&mut self, word: &str, index: Option<usize>) -> &mut Node {
        let mut node = self;
        for &ch in word.as_bytes() {
            node = node.values.entry(ch).or_default();
        }

        if let Some(index) = index {
            node.index = NonZeroUsize::new(index + 1);
        }

        node
    }

    pub fn find(&self, term: &str) -> Option<&Node> {
        let mut node = self;
        for ch in term.as_bytes() {
            node = node.values.get(ch)?;
        }
        Some(node)
    }

    pub fn collect(&self) -> Vec<usize> {
        let mut result = vec![];
        collect(self, &mut result);
        result
    }
}

fn collect(node: &Node, dst: &mut Vec<usize>) {
    if let Some(idx) = node.index.clone() {
        dst.push(idx.get() - 1);
    }

    for next in node.values.values() {
        collect(next, dst);
    }
}

struct WordFilter {
    trie: Node,
    words: Vec<String>,
}

impl WordFilter {
    fn new(words: Vec<String>) -> Self {
        let mut trie = Node::default();

        for (idx, word) in words.iter().enumerate() {
            trie.insert(&word, Some(idx));
        }

        Self { trie, words }
    }

    fn f(&self, prefix: String, suffix: String) -> i32 {
        if let Some(node) = self.trie.find(&prefix) {
            let mut words = node.collect();
            words.sort_unstable();

            for word_idx in words.iter().copied().rev() {
                if self.words[word_idx].ends_with(&suffix) {
                    return word_idx as i32;
                }
            }
        }

        NO_SUCH_WORD
    }
}