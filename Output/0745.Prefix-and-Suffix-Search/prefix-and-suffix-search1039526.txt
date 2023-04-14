// https://leetcode.com/problems/prefix-and-suffix-search/solutions/1039526/rust-trie/
struct WordFilter {
    root: Trie
}

impl WordFilter {

    fn new(words: Vec<String>) -> Self {
        let mut trie = Trie::new();
        for i in 0..words.len() {
            Trie::insert(&mut trie, &words[i], i as i32);
        }

        Self { root: trie }
    }
    
    fn f(&self, prefix: String, suffix: String) -> i32 {
        let extended = format!("{}{}{}", &suffix[..], "{", &prefix[..]);
        Trie::search(&self.root, extended)
    }
}

#[derive(Default)]
struct Trie {
    weight: i32,
    children: [Option<Box<Trie>>; 27]
}

impl Trie {
    fn new() -> Self {
        Default::default()
    }

    pub fn insert(root: &mut Trie, word: &String, weight: i32) {
        let extended = format!("{}{}{}", &word[..], "{", &word[..]); 
        for i in 0..=word.len() {
            Self::helper(root, &extended, i, extended.len(), weight);
        }
    }

    fn helper(root: &mut Trie, extended: &String, start: usize, end: usize, weight: i32) {
        let mut node = root;
        for i in start..end {
            let idx = (extended.as_bytes()[i] - b'a') as usize;
            node = node.children[idx].get_or_insert(Box::new(Trie::new()));
            node.weight = weight;
        }
    }

    pub fn search(root: &Trie, extended: String) -> i32 {
        let mut node = root;
        for &ch in extended.as_bytes() {
            match node.children[(ch - b'a') as usize].as_ref() {
                None => { return -1; },
                Some(next) => { node = next; }
            }
        }
        node.weight
    }
}