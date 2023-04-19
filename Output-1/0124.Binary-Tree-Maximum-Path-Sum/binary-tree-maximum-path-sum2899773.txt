// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2899773/rust-recursion-solution-90-faster-100-lower/
// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
// 
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode {
//       val,
//       left: None,
//       right: None
//     }
//   }
// }
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn helper(root: Option<Rc<RefCell<TreeNode>>>) -> (Option<i32>, Option<i32>) {
            if let Some(v) = root {
                let left = helper(v.borrow_mut().left.take());
                let right = helper(v.borrow_mut().right.take());
                let z = v.borrow().val;
                return match (left, right) {
                    ((Some(l), Some(v)), (Some(r), Some(v2))) => {
                        return (
                            Some(z.max(l + z).max(r + z)),
                            Some(v.max(v2)
                                    .max(l + r + z)
                                    .max(z)
                                    .max(l)
                                    .max(r)
                                    .max(l + z)
                                    .max(r + z),
                         ),
                        );
                    }
                    ((Some(l), Some(v)), (None, None)) => {
                        return (Some(z.max(l + z)), Some(v.max(l+z).max(z) ));
                    }
                    ((None, None), (Some(l), Some(v))) => {
                        return (Some(z.max(l + z)), Some(v.max(l+z).max(z) ));
                    }
                    ((None, None), ((None, None))) => {
                        return (Some(z), Some(z));
                    }
                    (_, _) => todo!(),
                };
            }
            (None, None)
        }
        let (a, b) = helper(root);
        a.unwrap().max(b.unwrap())
 
    }
}