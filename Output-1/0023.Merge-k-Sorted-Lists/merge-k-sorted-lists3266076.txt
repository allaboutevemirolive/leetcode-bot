// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3266076/rust-solution/
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
        let mut total = vec![];
        lists.iter().for_each(|mut list| {
            while let Some(node) = list {
                total.push(node.val);
                list = &node.next;
            }
        });
        total.sort_unstable();
        let mut current = Box::new(ListNode::new(0));
        let mut head = current.as_mut();
        for &val in total.iter() {
            head.next = Some(Box::new(ListNode::new(val)));
            head = head.next.as_mut().unwrap();
        };
        current.next
    }
}