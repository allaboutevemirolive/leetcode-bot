// https://leetcode.com/problems/prefix-and-suffix-search/solutions/371603/rust-beats-100-speed-100-memory-single-trie-third-approach-solution/
/**
 * Your WordFilter object will be instantiated and called as such:
 * let obj = WordFilter::new(words);
 * let ret_1: i32 = obj.f(prefix, suffix);
 */

struct WordFilter {
    trie: Trie<u8, i32>,
}

/**
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl WordFilter {
    fn new(words: Vec<String>) -> Self {
        let mut t: Trie<u8, i32> = Trie::new();
        for (weight, word) in words.iter().enumerate() {
            // add suffixes#word to the table
            // including word.len() to add "#word"
            for i in 0..=word.len() {
                let mut path = String::from(&word[i..word.len()]);
                path.push('#');
                path.push_str(&word);
                t.insert(path.as_bytes(), weight as i32);
            }
        }
        Self { trie: t }
    }

    fn f(&self, prefix: String, suffix: String) -> i32 {
        let mut s = String::from(suffix);
        s.push('#');
        s.push_str(&prefix);
        let query = s.as_bytes();
        if let Some(result) = self.trie.fetch(query) {
            result
        } else {
            -1
        }
    }
}

// trie modified from https://github.com/jmtuley/rust-trie
// only keeps the last value that matches Trie path
// value is kept on every node instead of the ending node
use std::collections::HashMap;
use std::hash::Hash;

pub struct Trie<K, V>
where
    K: Eq + Hash + Clone,
    V: Clone,
{
    value: Option<V>,
    children: HashMap<K, Trie<K, V>>,
}

impl<K, V> Trie<K, V>
where
    K: Eq + Hash + Clone,
    V: Clone,
{
    fn new() -> Trie<K, V> {
        Trie {
            value: None,
            children: HashMap::new(),
        }
    }

    fn insert(&mut self, path: &[K], v: V) {
        // because we parse weights from 0 to highest, we actually don't have 
        // to keep track of all weights that match this path, only the last one
        // so we're free to replace older values with a new, higher value. if order
        // wasn't garanteed we would only replace if new value is higher than current
        // if we needed all weights that match path, value would be a Vec<V> and we'd push 
        // every weight, but for our use case that would be a massive waste of space.
        self.value = Some(v.clone());
        if path.is_empty() {
            return;
        }

        self.children
            .entry(path[0].clone())
            .or_insert(Trie::new())
            .insert(&path[1..], v)
    }

    fn fetch(&self, path: &[K]) -> Option<V> {
        match path.len() {
            0 => self.value.clone(),
            _ => self
                .children
                .get(&path[0])
                .and_then(|child| child.fetch(&path[1..])),
        }
    }
}