// https://leetcode.com/problems/maximum-frequency-stack/solutions/1863280/rust-two-solutions-hashmap-treemap-with-explanations/
use std::collections::hash_map::Entry;
use std::collections::{BTreeMap, HashMap};

#[derive(Default)]
struct FreqStack {
    freq: HashMap<i32, u32>,
    ordr: BTreeMap<u32, Vec<i32>>,
}

impl FreqStack {
    fn new() -> Self {
        Default::default()
    }

    fn push(&mut self, val: i32) {
        // Find out the frequency of this element
        let count = *self.freq.entry(val).and_modify(|x| *x += 1).or_insert(1);

        // push it to the leaf node responsible for elements with that frequency  
        self.ordr.entry(count).or_default().push(val);
    }

    fn pop(&mut self) -> i32 {
        // find the most frequent element and pop() it from the stack
        let (&freq, values) = self.ordr.iter_mut().last().unwrap();
        let element = values.pop().unwrap();

        // If there are no more elements with that frequency we have to remove 
        // the vec/stack from the tree, so that we can keep the invariant that 
        // `last()` is returning the most frequent elements
        if values.is_empty() {
            self.ordr.remove(&freq);
        }

        // decrement the frequency of that element, optionally we can remove it from the hashmap 
        // if its frequency becomes 0 in order to reduce the memory usage
        match self.freq.entry(element) {
            Entry::Vacant(_) => unreachable!(),
            Entry::Occupied(mut e) => {
                let value = e.get_mut();
                if *value > 1 {
                    *value -= 1;
                } else {
                    e.remove();
                }
            }
        }

        // return thr most frequent element
        element
    }
}