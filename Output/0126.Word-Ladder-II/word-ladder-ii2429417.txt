// https://leetcode.com/problems/word-ladder-ii/solutions/2429417/rust-4ms-august-2022-trie-graph-bfs-parentlink-dfs-solution/
use std::cmp::Ordering;
use std::collections::{HashMap, HashSet, VecDeque};
use std::iter::FromIterator;

trait LowercaseIndex {
    fn lowercase_index(&self) -> usize;
}

impl LowercaseIndex for u8 {
    #[inline]
    fn lowercase_index(&self) -> usize {
        (self - b'a') as usize
    }
}

struct TrieNode {
    children: Vec<Option<TrieNode>>,
    word_index: Option<usize>,
}

impl Default for TrieNode {
    #[inline]
    fn default() -> Self {
        let mut children = Vec::with_capacity(26);
        for _ in 0..26 {
            children.push(None)
        }
        Self { children, word_index: None }
    }
}

#[derive(Default)]
struct Trie {
    root: TrieNode,
    // Trie will own words and store word indices in leafs
    words: Vec<String>,
}

impl Trie {
    #[inline]
    fn insert(&mut self, word: String) {
        self.get_or_create_path(word.bytes()).word_index = Some(self.words.len());
        self.words.push(word);
    }

    #[inline]
    fn get_or_create_path(&mut self, path: impl Iterator<Item = u8>) -> &mut TrieNode {
        path.fold(&mut self.root, |root, ch| root.children[ch.lowercase_index()].get_or_insert_with(TrieNode::default))
    }

    #[inline]
    fn traverse(root: &TrieNode, mut path: impl Iterator<Item = u8>) -> Option<&TrieNode> {
        path.try_fold(root, |root, ch| root.children[ch.lowercase_index()].as_ref())
    }

    fn contains(&self, word: &str) -> bool {
        match Self::traverse(&self.root, word.bytes()) {
            None => false,
            Some(node) => node.word_index.is_some(),
        }
    }

    fn get_all_substitutions(&self, word: &str) -> HashSet<&str> {
        let mut substitutions = HashSet::new();
        for i in 0..word.len() {
            self.get_substitutions(&word[..i], &word[i + 1..], &mut substitutions);
        }
        substitutions.remove(word);
        substitutions
    }

    fn get_substitutions<'a>(&'a self, prefix: &str, suffix: &str, substitutions: &mut HashSet<&'a str>) {
        let prefix_root = if let Some(root) = Self::traverse(&self.root, prefix.bytes()) {
            root
        } else {
            return;
        };

        for node in prefix_root.children.iter().flatten() {
            if let Some(last_node) = Self::traverse(node, suffix.bytes()) {
                if let Some(index) = last_node.word_index {
                    substitutions.insert(self.words[index].as_str());
                }
            }
        }
    }
}

impl FromIterator<String> for Trie {
    #[inline]
    fn from_iter<T: IntoIterator<Item = String>>(iter: T) -> Self {
        let mut trie = Trie::default();
        for word in iter {
            trie.insert(word);
        }
        trie
    }
}

impl Solution {
    pub fn find_ladders(begin_word: String, end_word: String, word_list: Vec<String>) -> Vec<Vec<String>> {
        let mut trie = Trie::from_iter(word_list);
        trie.insert(begin_word.clone());

        let mut result = vec![];

        // task description constraint
        if !trie.contains(&end_word) {
            return result;
        }

        // we don't need to deploy heavy machinery until after we know that there are at least some
        // paths leading out from the `begin_word`
        if trie.get_all_substitutions(&begin_word).is_empty() {
            return result;
        }

        let graph = Self::build_graph(&trie, &begin_word, &end_word);
        let parents = Self::build_shortest_parent_links(&graph, &begin_word);

        let mut path = vec![end_word.as_str()];
        Self::dfs(&parents, &mut path, &end_word, &mut result);

        result
    }

    fn dfs<'a>(
        parent_links: &HashMap<&'a str, Vec<&'a str>>,
        path: &mut Vec<&'a str>,
        current_node: &'a str,
        result: &mut Vec<Vec<String>>,
    ) {
        if let Some(current_node_parents) = parent_links.get(current_node) {
            for &parent in current_node_parents {
                path.push(parent);
                Self::dfs(parent_links, path, parent, result);
                path.pop();
            }
        } else {
            // we have reached the beginning
            result.push(path.iter().rev().map(|word| word.to_string()).collect());
        }
    }

    /// Traverses the graph and records only shortest links from a node to its parent.
    fn build_shortest_parent_links<'a>(
        graph: &HashMap<&str, Vec<&'a str>>,
        begin_word: &'a str,
    ) -> HashMap<&'a str, Vec<&'a str>> {
        let mut queue = VecDeque::from([begin_word]);
        let mut parent_links: HashMap<&str, Vec<&str>> = HashMap::new();

        // we record distances from the begin_word and use the distances map to track visited nodes
        let mut distances = HashMap::with_capacity(graph.len());
        distances.insert(begin_word, 0);

        while !queue.is_empty() {
            let word = queue.pop_front().unwrap();
            let word_distance = *distances.get(word).unwrap();

            for &neighbour in graph.get(word).into_iter().flatten() {
                let parents = parent_links.entry(neighbour).or_insert_with(Vec::new);

                let neighbour_distance = distances.entry(neighbour).or_insert_with(|| {
                    // (1) we have not visited this neighbour yet: add it to queue
                    queue.push_back(neighbour);
                    // and set its distance to the next value after the parent (`word`)
                    word_distance + 1
                });

                match (word_distance + 1).cmp(neighbour_distance) {
                    // either it's a 'fresh' node added at (1) or its distance is equal, so we store it
                    Ordering::Equal => {
                        parents.push(word);
                    }
                    // we have found a better parent with a shorter distance
                    Ordering::Less => {
                        *neighbour_distance = word_distance + 1;
                        // all other parents are no more needed
                        parents.clear();
                        parents.push(word);
                    }
                    Ordering::Greater => {}
                }
            }
        }

        parent_links
    }

    /// Builds the minimal possible graph containing only potentially needed vertices that might
    /// lead to the `end_word`.
    fn build_graph<'a>(trie: &'a Trie, begin_word: &'a str, end_word: &str) -> HashMap<&'a str, Vec<&'a str>> {
        let mut queue = VecDeque::from([begin_word]);
        let mut visited = HashSet::new();

        // if we use just one visited hashset, we will loose some connections that can lead us
        // to the end_word
        let mut level_visited = HashSet::from([begin_word]);

        let mut found = false;

        let mut graph = HashMap::new();

        while !found && !queue.is_empty() {
            visited.extend(level_visited.drain());

            for _ in 0..queue.len() {
                let word = queue.pop_front().unwrap();

                for substitution in trie.get_all_substitutions(word) {
                    if substitution == end_word {
                        found = true;
                    }

                    if !visited.contains(substitution) {
                        graph.entry(word).or_insert_with(Vec::new).push(substitution);
                    }

                    if !visited.contains(substitution) && !level_visited.contains(substitution) {
                        level_visited.insert(substitution);
                        queue.push_back(substitution);
                    }
                }
            }
        }

        graph
    }
}