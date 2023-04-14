// https://leetcode.com/problems/my-calendar-iii/solutions/2671927/rust-bst-segment-tree-very-long-code/
use std::cell::RefCell;
use std::cmp::Ordering;
use std::rc::Rc;

type OptNode = Option<Rc<RefCell<SegmentTreeNode>>>;

struct SegmentTreeNode {
    time: i32, // start or end time
    left_total: i32,
    // let x = number of bookings happening at current time.
    // then x(this node) = left_total + x(parent) if this node is a right child
    // or x(this node) = left_total otherwise
    max_count: i32, // maximum k possible in this subtree
    left: OptNode,
    right: OptNode,
}

struct MyCalendarThree {
    root: OptNode,
}

/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyCalendarThree {

    fn new() -> Self {
        Self {
            root: None,
        }
    }
    
    fn book(&mut self, start: i32, end: i32) -> i32 {
        Self::dfs(&mut self.root, start, 1);
        Self::dfs(&mut self.root, end, -1);
        self.root.as_ref().unwrap().borrow().max_count
    }

    fn dfs(node: &mut OptNode, time: i32, change: i32) {
        if let Some(n) = node.as_ref() {
            let mut b = n.borrow_mut();
            match time.cmp(&b.time) {
                Ordering::Equal => {
                    b.left_total += change;
                }
                Ordering::Less => {
                    b.left_total += change;
                    Self::dfs(&mut b.left, time, change);
                }
                Ordering::Greater => {
                    Self::dfs(&mut b.right, time, change);
                }
            }
        }
        else {
            *node = Some(Rc::new(RefCell::new(SegmentTreeNode {
                time,
                left_total: change,
                max_count: change.max(0),
                left: None,
                right: None,
            })));
        }
        Self::update_stat(node);
    }

    fn update_stat(node: &OptNode) {
        let mut b = node.as_ref().unwrap().borrow_mut();
        b.max_count = b.left_total
            .max(b.left.as_ref().map_or(0, |n| n.borrow().max_count))
            .max(b.left_total + b.right.as_ref().map_or(0, |n| n.borrow().max_count));
    }
}