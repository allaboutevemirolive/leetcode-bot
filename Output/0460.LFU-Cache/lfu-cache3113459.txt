// https://leetcode.com/problems/lfu-cache/solutions/3113459/rust-with-rc-refcell-listnode/
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

type RcNode = Rc<RefCell<ListNode>>;
type OptNode = Option<RcNode>;

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub key: i32,
    pub val: i32,
    pub count: usize,
    pub prev: OptNode,
    pub next: OptNode,
}

impl ListNode {
    #[inline]
    fn new(key: i32, val: i32, count: usize) -> Self {
        ListNode {
            key,
            val,
            count,
            prev: None,
            next: None,
        }
    }

    fn new_rc(key: i32, val: i32, count: usize) -> RcNode {
        Rc::new(RefCell::new(ListNode::new(key, val, count)))
    }

    fn link(before: &RcNode, after: &RcNode) {
        before.borrow_mut().next = Some(Rc::clone(after));
        after.borrow_mut().prev = Some(Rc::clone(before));
    }

    fn insert(node: &RcNode, after: &RcNode) {
        let before = after.borrow_mut().prev.take().unwrap();
        Self::link(&before, node);
        Self::link(node, after);
    }

    fn remove(node: &RcNode) {
        let before = node.borrow_mut().prev.take().unwrap();
        let after = node.borrow_mut().next.take().unwrap();
        Self::link(&before, &after);
    }
}

struct LFUCache {
    hash: HashMap<i32, RcNode>,
    dummies: Vec<RcNode>,
    capacity: i32,
    used: i32,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl LFUCache {

    fn new(capacity: i32) -> Self {
        Self {
            hash: HashMap::new(),
            dummies: vec![ListNode::new_rc(-1, -1, 0)],
            capacity,
            used: 0,
        }
    }
    
    fn get(&mut self, key: i32) -> i32 {
        match self.hash.get_mut(&key) {
            None => -1,
            Some(rc) => {
                let count = rc.borrow().count;
                let val = rc.borrow().val;
                ListNode::remove(rc);
                rc.borrow_mut().count += 1;
                let rc2 = Rc::clone(rc);
                self.insert(&rc2, count + 1);
                val
            }
        }
    }
    
    fn put(&mut self, key: i32, value: i32) {
        if self.capacity == 0 {
            return;
        }
        match self.hash.get_mut(&key) {
            None => {
                if self.used == self.capacity {
                    self.remove_LFU();
                }
                else {
                    self.used += 1;
                }
                let rc = ListNode::new_rc(key, value, 1);
                self.hash.insert(key, Rc::clone(&rc));
                self.insert(&rc, 1);
            }
            Some(rc) => {
                let count = rc.borrow().count;
                ListNode::remove(rc);
                rc.borrow_mut().val = value;
                rc.borrow_mut().count += 1;
                let rc2 = Rc::clone(rc);
                self.insert(&rc2, count + 1);
            }
        }
    }

    fn insert(&mut self, rc: &RcNode, count: usize) {
        if self.dummies.len() == count {
            let dummy = ListNode::new_rc(-1, -1, count);
            let last = self.dummies.last().unwrap();
            ListNode::link(last, &dummy);
            self.dummies.push(dummy);
        }
        ListNode::insert(rc, &self.dummies[count]);
    }

    fn remove_LFU(&mut self) {
        let mut rc = Rc::clone(&self.dummies[0]);
        while rc.borrow().val == -1 {
            let temp = Rc::clone(rc.borrow().next.as_ref().unwrap());
            rc = temp;
        }
        let key = rc.borrow().key;
        self.hash.remove(&key);
        ListNode::remove(&rc);
    }
}

/**
 * Your LFUCache object will be instantiated and called as such:
 * let obj = LFUCache::new(capacity);
 * let ret_1: i32 = obj.get(key);
 * obj.put(key, value);
 */