// https://leetcode.com/problems/all-oone-data-structure/solutions/3095845/avg-o-1-linkedlist-hashmap-interior-mutability-and-iterators/
use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

struct DualNode {
    prev: Option<Rc<RefCell<DualNode>>>,
    value: String,
    count: u32,
    next: Option<Rc<RefCell<DualNode>>>,
}

impl std::fmt::Debug for DualNode {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "(*, {}, {}, *)", self.value, self.count)
    }
}

struct DualNodeIterator {
    current: Option<Rc<RefCell<DualNode>>>,
}

impl Iterator for DualNodeIterator {
    type Item = Rc<RefCell<DualNode>>;

    fn next(&mut self) -> Option<Rc<RefCell<DualNode>>> {
        self.current.take().map(|node| {
            self.current = node.borrow().next.clone();
            node
        })
    }
}

struct DualNodeReverseIterator {
    current: Option<Rc<RefCell<DualNode>>>,
}

impl Iterator for DualNodeReverseIterator {
    type Item = Rc<RefCell<DualNode>>;

    fn next(&mut self) -> Option<Rc<RefCell<DualNode>>> {
        self.current.take().map(|node| {
            self.current = node.borrow().prev.clone();
            node
        })
    }
}

impl DualNode {
    fn new(value: String) -> Self {
        Self {
            prev: None,
            value,
            count: 1,
            next: None,
        }
    }

    fn iter_next(&self) -> DualNodeIterator {
        DualNodeIterator {
            current: self.next.clone()
        } 
    }

    fn iter_prev(&self) -> DualNodeReverseIterator {
        DualNodeReverseIterator {
            current: self.prev.clone()
        }
    }
}

struct AllOne {
    below: Rc<RefCell<DualNode>>,
    above: Rc<RefCell<DualNode>>,
    map: HashMap<String, Rc<RefCell<DualNode>>>,
}

fn new_node(val: String) -> Rc<RefCell<DualNode>> {
    Rc::new(RefCell::new(DualNode::new(val))) 
}

fn insert_after(prev: Rc<RefCell<DualNode>>, new: Rc<RefCell<DualNode>>) {
    let mut prev_inner = prev.borrow_mut();
    let mut new_inner = new.borrow_mut();
    let next = prev_inner.next.clone();

    if let Some(next) = next {
        let mut next_inner = next.borrow_mut();
        next_inner.prev = Some(new.clone());
    }

    new_inner.prev = Some(prev.clone());
    new_inner.next = prev_inner.next.clone();
    prev_inner.next = Some(new.clone());
}

fn insert_before(next: Rc<RefCell<DualNode>>, new: Rc<RefCell<DualNode>>) {
    let mut next_inner = next.borrow_mut();
    let mut new_inner = new.borrow_mut();
    let prev = next_inner.prev.clone();

    if let Some(prev) = prev {
        let mut prev_inner = prev.borrow_mut();
        prev_inner.next = Some(new.clone());
    }

    new_inner.next = Some(next.clone());
    new_inner.prev = next_inner.prev.clone();
    next_inner.prev = Some(new.clone());
}

fn remove(node: Rc<RefCell<DualNode>>) {
    let mut node_inner = node.borrow_mut();
    let mut prev = node_inner.prev.clone();
    if let Some(prev) = prev {
        let mut prev_inner = prev.borrow_mut();
        prev_inner.next = node_inner.next.clone();
    }

    let mut next = node_inner.next.clone();
    if let Some(next) = next {
        let mut next_inner = next.borrow_mut();
        next_inner.prev = node_inner.prev.clone();
    }

    node_inner.next = None;
    node_inner.prev = None;
}

/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl AllOne {

    fn new() -> Self {
        let below = Rc::new(RefCell::new(DualNode::new("".to_string())));
        let above = Rc::new(RefCell::new(DualNode::new("".to_string())));
        {
            let mut b = below.borrow_mut();
            b.count = u32::MIN;
            b.next = Some(above.clone());
        }
        {
            let mut a = above.borrow_mut();
            a.count = u32::MAX;
            a.prev = Some(below.clone());
        }
        Self {
            below,
            above,
            map: HashMap::new(),
        }
    }

    fn inc(&mut self, key: String) {
        let below = self.below.clone();
        self.map.entry(key.clone()).and_modify(|node| {
            let (count, mut it) = {
                let mut node = node.borrow_mut();
                node.count += 1;
                (node.count, node.iter_next())
            };
            remove(node.clone());
            let next = it.find(|node| node.borrow().count > count)
                .expect("Could not find node with greater count later, shouldn't be possible");
            insert_before(next, node.clone());

        }).or_insert_with(|| {
            let nn = new_node(key.to_string());
            insert_after(below, nn.clone());
            nn
        });
    }
    
    fn dec(&mut self, key: String) {
        let (node, count) = {
            let node = self.map.get(&key)
                .expect("This should be guaranteed to exist");
            let mut inner = node.borrow_mut();
            inner.count -= 1;
            (node.clone(), inner.count)
        };
        if count == 0 {
            remove(self.map.remove(&key)
                .expect("This should be guaranteed to exist"));
        } else {
            let mut it = node.borrow().iter_prev();
            remove(node.clone());
            let prev = it.find(|node| node.borrow().count < count)
                .expect("Could not find node with lesser count earlier, shouldn't be possible");
            insert_after(prev, node)
        }
    }
    
    fn get_max_key(&self) -> String {
        self.above.borrow().prev.as_ref().unwrap().borrow().value.clone()
    }
    
    fn get_min_key(&self) -> String {
        self.below.borrow().next.as_ref().unwrap().borrow().value.clone()
    }
}

impl std::fmt::Display for AllOne {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let mut nodes_string = String::new();
        let mut next = Some(self.below.clone());
        while let Some(node) = next {
            let node = node.borrow();
            nodes_string.push_str(format!("({}, {}) ", node.value, node.count).as_str());
            next = node.next.clone(); 
        }
        write!(f, "Nodes: {}\n", nodes_string)
    }
}


