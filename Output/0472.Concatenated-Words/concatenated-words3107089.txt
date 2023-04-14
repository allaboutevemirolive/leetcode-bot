// https://leetcode.com/problems/concatenated-words/solutions/3107089/rust-optimized-trie-25ms/
use std::collections::BTreeSet;

impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>)
        -> Vec<String> 
    {
        let mut trie   = Trie::new(); 
        let mut result = vec![];
        let mut idxs   = BTreeSet::new();

        words.iter().for_each(|w| trie.insert(w));
        
        for word in words {
            let mut i = 0;
            while i < word.len() {
                match trie.find(&word[i..]) {
                    Ok(terms) if i != 0 => { result.push(word); break; },
                    Ok(terms) |
                    Err(terms) => idxs.extend(terms.iter().map(|&t| i + t)),
                }
                if let Some(j) = idxs.range(i + 1..).next().copied() 
                     { i = j; } 
                else { break; }
            }
            idxs.clear();
        }
        result
    }
}

/// Converts a byte value into an array index used internally by the trie.
/// 
macro_rules! idx {
    ($b:expr) => { ($b - b'a') as usize }
}

/// A handle to a trie node.
/// 
#[repr(transparent)]
#[derive(Clone, Copy, PartialEq)]
struct HNode(u16);

/// The node type that populates the trie.
///
#[repr(packed)]
#[derive(Clone, Copy)]
struct Node {
    terminal : bool,
    children : [HNode; 26],
}
impl Node {
    fn new() -> Self {
        Self { terminal: false, children: [HNode(u16::MAX); 26] }
    }
}

/// A trie with compact nodes allocated in contiguous memory.
/// 
struct Trie {
    root  : HNode,
    nodes : Vec<Node>,
}

impl Trie {
    fn new() -> Self {
        let mut nodes = vec![Node::new()];
        Self { root: HNode(0), nodes }
    }
    /// Inserts the word into the Trie.
    /// 
    fn insert(&mut self, word: &str) {
        let mut hnode = self.root;
        for b in word.bytes() {
            let h = self.get(hnode).children[idx!(b)];
            if h != HNode(u16::MAX) {
                hnode = h;
            } else {
                let h = self.new_node();
                self.get_mut(hnode).children[idx!(b)] = h;
                hnode = h;
            }
        }
        self.get_mut(hnode).terminal = true;
    }
    /// Returns `Ok(...)` if the complete word is in the Trie, or
    /// returns `Err(...)` if it isn't. Each variant will hold the indices of
    /// terminal points found while checking `word`.
    /// 
    fn find(&self, word: &str) -> Result<Vec<usize>, Vec<usize>> {
        let mut hnode = self.root;
        let mut len   = 0;
        let mut terms = vec![];
        for b in word.bytes() {
            let h = self.get(hnode).children[idx!(b)];
            if h != HNode(u16::MAX) {
                hnode = h;
                len += 1;
                if self.get(hnode).terminal {
                    terms.push(len);
                }
            } else {
                return Err(terms);
            }
        }
        if self.get(hnode).terminal { Ok(terms) } else { Err(terms) }
    }
    /// Creates a new trie node and returns a handle to it.
    /// 
    fn new_node(&mut self) -> HNode {
        self.nodes.push(Node::new());
        HNode(self.nodes.len() as u16 - 1)
    }
    /// Returns a reference to the trie node the handle represents.
    /// 
    #[inline]
    fn get(&self, handle: HNode) -> &Node {
        &self.nodes[handle.0 as usize]
    }
    /// Returns a mutable reference to the trie node the handle represents.
    /// 
    #[inline]
    fn get_mut(&mut self, handle: HNode) -> &mut Node {
        &mut self.nodes[handle.0 as usize]
    }
}