// https://leetcode.com/problems/serialize-and-deserialize-binary-tree/solutions/2695988/rust-preorder-split-iterator/
use std::cell::RefCell;
use std::rc::Rc;
struct Codec {}

impl Codec {
    const EMPTY: &'static str = "e";

    fn new() -> Self {
        Codec {}
    }

    fn serialize(&self, root: Option<Rc<RefCell<TreeNode>>>) -> String {
        let mut res = String::new();
        let mut stack = vec![root];
        while let Some(node) = stack.pop() {
            if let Some(node) = node {
                let mut node = node.as_ref().borrow_mut();
                res.push_str(&node.val.to_string());
                res.push(' ');
                stack.push(node.right.take());
                stack.push(node.left.take());
            } else {
                res.push_str(Self::EMPTY);
                res.push(' ');
            }
        }
        res
    }

    fn deserialize(&mut self, data: String) -> Option<Rc<RefCell<TreeNode>>> {
        let mut parts = data.split_ascii_whitespace();
        self.do_deserialize(&mut parts)
    }

    fn do_deserialize<'a>(
        &mut self,
        parts: &mut impl Iterator<Item = &'a str>,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        if let Some(next) = parts.next() {
            if next == Self::EMPTY {
                None
            } else {
                Some(Rc::new(RefCell::new(TreeNode {
                    val: next.parse::<i32>().unwrap(),
                    left: self.do_deserialize(parts),
                    right: self.do_deserialize(parts),
                })))
            }
        } else {
            None
        }
    }
}