// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3260760/extremely-simple-solution-in-rust/
// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
// 
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode {
//       next: None,
//       val
//     }
//   }
// }
impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut vec = vec![];
        for mut list in lists {
            while let Some(node) = list {
                vec.push(node.val);
                list = node.next;
            }
        }
        vec.sort();
        create_list(vec) 
    }
}

fn create_list(vals: Vec<i32>) -> Option<Box<ListNode>> {
    let mut head = None;
    for val in vals.into_iter().rev() {
        let mut cur = ListNode::new(val);
        cur.next = head;
        head = Some(Box::new(cur));
    }
    head
}