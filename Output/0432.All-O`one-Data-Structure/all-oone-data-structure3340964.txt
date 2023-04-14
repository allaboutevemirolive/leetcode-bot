// https://leetcode.com/problems/all-oone-data-structure/solutions/3340964/26ms-runtime-strictly-o-1-solution-only-using-hashmap-hashset-without-rc-refcell/
use std::{
    collections::{HashMap, HashSet},
    ops::{Deref, DerefMut},
};

#[derive(Default)]
struct Node {
    prev: Option<usize>,
    next: Option<usize>,
    set: HashSet<String>,
}

impl Deref for Node {
    type Target = HashSet<String>;
    fn deref(&self) -> &Self::Target {
        &self.set
    }
}
impl DerefMut for Node {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.set
    }
}
#[derive(Default)]
struct AllOne {
    str_to_cnt: HashMap<String, usize>,
    cnt_to_node: HashMap<usize, Node>,
    min_key: Option<usize>,
    max_key: Option<usize>,
}

impl AllOne {
    fn new() -> Self {
        Default::default()
    }

    fn get_max_key(&self) -> String {
        self.get_key(self.max_key)
    }

    fn get_min_key(&self) -> String {
        self.get_key(self.min_key)
    }

    fn dec(&mut self, key: String) {
        // get current count
        let curr_cnt = self
            .str_to_cnt
            .get_mut(&key)
            .expect("key to decrement not in mapping");
        // update key to node mapping
        *curr_cnt -= 1;
        let new_cnt = curr_cnt.clone();
        if new_cnt == 0 {
            // kill the key and fix min key
            self.erase_existence(&key);
            return;
        }
        // remove key from old node
        let curr_node = self.cnt_to_node.get_mut(&(new_cnt + 1)).unwrap();
        curr_node.remove(&key);
        let purge = curr_node.is_empty();
        let (prev, next) = (curr_node.prev, curr_node.next);
        // update binding of curr_node
        curr_node.prev = Some(new_cnt);
        // insert key into new node
        let new_node = self
            .cnt_to_node
            .entry(new_cnt)
            .or_insert_with(|| Default::default());
        new_node.insert(key);
        // fix all key bindings
        new_node.next = Some(new_cnt + 1);
        if prev != Some(new_cnt) {
            new_node.prev = prev;
        }
        if purge {
            self.remove_node_completely(Some(new_cnt), next);
        }
        if new_cnt < self.min_key.unwrap() {
            self.min_key = Some(new_cnt);
        }
    }

    fn inc(&mut self, key: String) {
        // get current count
        if let Some(curr_cnt) = self.str_to_cnt.get_mut(&key) {
            let node = self.cnt_to_node.get_mut(&curr_cnt).unwrap();
            // remove from old node
            node.remove(&key);
            // update key to node mapping
            *curr_cnt += 1;
            let new_cnt = curr_cnt.clone();
            let (prev, next) = (node.prev, node.next);
            // update current node next binding
            node.next = Some(new_cnt);
            let purge = node.is_empty();
            // insert key into new node
            let new_node = self
                .cnt_to_node
                .entry(new_cnt)
                .or_insert_with(|| Default::default());
            new_node.insert(key);
            // fix all the bindings
            new_node.prev = Some(new_cnt - 1);
            if next != Some(new_cnt) {
                new_node.next = next;
            }
            if purge {
                // this fix min key if required
                self.remove_node_completely(prev, Some(new_cnt));
            }
            if self.max_key.unwrap() < new_cnt {
                // fix max key if required
                self.max_key = Some(new_cnt);
            }
        } else {
            // autofix min and max keys
            self.give_birth_with(key);
        }
    }

    fn get_key(&self, key: Option<usize>) -> String {
        if let Some(key) = key {
            return self
                .cnt_to_node
                .get(&key)
                .unwrap()
                .iter()
                .next()
                .unwrap()
                .clone();
        }
        String::new()
    }

    fn give_birth_with(&mut self, key: String) {
        // map key to node
        let min_key = self.min_key;
        self.str_to_cnt.insert(key.clone(), 1);
        let first_node = self
            .cnt_to_node
            .entry(1)
            .or_insert_with(|| Default::default());
        // update its bindings
        first_node.prev = None;
        if min_key != Some(1) {
            first_node.next = min_key;
        }
        // insert key in node
        first_node.insert(key);
        self.min_key = Some(1);
        if self.max_key.is_none() {
            self.max_key = Some(1);
        }
    }

    fn remove_node_completely(&mut self, node_prev: Option<usize>, node_next: Option<usize>) {
        match (node_prev, node_next) {
            (None, None) => (), // one can panic! here as it wont be handled by this function
            (None, Some(n_node)) => {
                // left extreme node
                let node = self.cnt_to_node.get_mut(&n_node).unwrap();
                node.prev = None;
                self.min_key = node_next;
            }
            (Some(p_node), None) => {
                // right extreme node
                self.cnt_to_node.get_mut(&p_node).unwrap().next = None;
                self.max_key = node_prev;
            }
            (Some(p_node), Some(n_node)) => {
                // some random middle node
                self.cnt_to_node.get_mut(&p_node).unwrap().next = node_next;
                self.cnt_to_node.get_mut(&n_node).unwrap().prev = node_prev;
            }
        }
    }

    fn erase_existence(&mut self, key: &str) {
        // remove key from map
        self.str_to_cnt.remove(key);
        let first_node = self.cnt_to_node.get_mut(&1).unwrap();
        // remove key from node
        first_node.remove(key);
        if first_node.is_empty() {
            // update min_key
            self.min_key = first_node.next;
            if let Some(to_be_front) = self.min_key {
                self.cnt_to_node.get_mut(&to_be_front).unwrap().prev = None;
            }
        }
    }
}