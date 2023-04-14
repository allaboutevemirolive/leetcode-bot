// https://leetcode.com/problems/concatenated-words/solutions/2417148/rust-iterative-trie-prefix-tree-solution/
use std::collections::HashMap;
use std::fmt::Debug;
use std::hash::Hash;

struct Node<T> {
    inner: HashMap<T, Node<T>>,
    is_word: bool,
}

impl<T> Node<T>
    where
        T: Hash + Eq + Copy + Debug,
{
    pub fn new() -> Self {
        Self {
            inner: HashMap::new(),
            is_word: false,
        }
    }

    pub fn insert(&mut self, word: impl Iterator<Item=T>) {
        let mut node = self;

        for ch in word {
            node = node.inner.entry(ch).or_insert_with(|| Node::new());
        }

        node.is_word = true;
    }

    pub fn is_concatenation_of(
        &self,
        word: impl Iterator<Item=T> + Clone,
        min_words: usize,
    ) -> bool {
        is_concatenation_of_min_words(self, word, min_words)
    }
}

fn is_concatenation_of_min_words<T: Hash + Eq + Copy + Debug>(
    trie: &Node<T>,
    word: impl Iterator<Item=T> + Clone,
    min_words: usize,
) -> bool {
    let mut stack = vec![];
    stack.push((trie, word, 0));

    'next: while let Some((root, mut word, mut count)) = stack.pop() {
        let mut node = root;
        let mut is_word = false;

        while let Some(ch) = word.next() {
            is_word = false;

            match node.inner.get(&ch) {
                None => {
                    // This character does not belong to any sub-word
                    // in the current trie node. Thus we have to
                    // abandon this attempt and try the next one if any
                    continue 'next;
                }

                Some(child) => {
                    if !child.is_word {
                        node = child;
                        continue;
                    }

                    // Push onto the stack the case where we did NOT match
                    // the current word in order to try it later if this
                    // attempt fails
                    stack.push((child, word.clone(), count));

                    // Mark that the current character is a word boundary
                    // This is important because we do not want to return
                    // any count if we exhaust all characters from `word`
                    // but fail to match the last sub-word - i.e. the last
                    // character is not a word end.
                    is_word = true;
                    count += 1;

                    // Because we've matched a concatenated word,
                    // we have to start matching from the Trie root
                    node = trie;
                }
            }
        }

        // If we did not match the last character, we have to try
        // with the rest of the remaining combinations.
        //
        // Also it's possible to have different match counts
        // for a given word:
        // ```
        // words = [a, b, c, ab, abc]
        // abc => 3 (a,b,c), 2(ab, c)
        // ```

        if is_word && count >= min_words {
            return true;
        }
    }

    false
}

pub fn find_all_concatenated_words_in_a_dict(mut words: Vec<String>) -> Vec<String> {
    let mut trie = Node::new();
    let mut answer = vec![];

    words.sort_unstable_by_key(|w| w.len());

    for word in words.drain(..) {
        trie.insert(word.bytes());
        if trie.is_concatenation_of(word.bytes(), 2) {
            answer.push(word);
        }
    }

    answer
}