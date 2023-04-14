// https://leetcode.com/problems/serialize-and-deserialize-binary-tree/solutions/2200933/rust-iterative-bfs/
use std::cell::RefCell;
use std::rc::Rc;
struct Codec {}

use std::collections::VecDeque;

impl Codec {
    fn new() -> Self {
        Self {}
    }

    fn serialize(&self, root: Option<Rc<RefCell<TreeNode>>>) -> String {
        let mut q = VecDeque::<Option<Rc<RefCell<TreeNode>>>>::new();
        q.push_back(root);

        let mut v = vec![];

        while let Some(node_opt) = q.pop_front() {
            v.push(match node_opt {
                None => "#".to_string(),
                Some(node_rc) => {
                    let mut node_ref = node_rc.borrow_mut();
                    q.push_back(node_ref.left.take());
                    q.push_back(node_ref.right.take());
                    node_ref.val.to_string()
                }
            });
        }

        v.join(",")
    }

    fn deserialize(&self, data: String) -> Option<Rc<RefCell<TreeNode>>> {
        let nodes = data
            .split(',')
            .map(|s| match s {
                "#" => None,
                n => Some(Rc::new(RefCell::new(TreeNode::new(
                    n.parse::<i32>().unwrap(),
                )))),
            })
            .collect::<Vec<_>>();

        let mut slow = 0;
        let mut fast = 1;
        let n = nodes.len();

        while fast < n {
            let m = fast;
            while slow < m {
                if let Some(node_rc) = &nodes[slow] {
                    node_rc.borrow_mut().left = nodes[fast].clone();
                    node_rc.borrow_mut().right = nodes[fast + 1].clone();
                    fast += 2;
                }
                slow += 1;
            }
        }

        nodes[0].clone()
    }
}