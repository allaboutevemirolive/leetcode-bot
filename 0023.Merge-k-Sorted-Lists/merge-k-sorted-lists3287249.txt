// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3287249/rust-short-solution/
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
        use std::cmp::*;
        use std::collections::BinaryHeap;

        impl PartialOrd<Self> for ListNode {
            fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
                Some(self.val.cmp(&other.val))
            }
        }

        impl Ord for ListNode {
            fn cmp(&self, other: &Self) -> Ordering {
                self.partial_cmp(other).unwrap()
            }
        }
        let mut queue = BinaryHeap::new();
        for l in lists.into_iter().flatten() {
            queue.push(Reverse(l));
        }
        let mut head = None;
        let mut tail = &mut head;
        while let Some(Reverse(mut n)) = queue.pop() {
            if n.next.is_some() {
                queue.push(Reverse(n.next.take().unwrap()));
            }
            let cur = tail.insert(n);
            tail = &mut cur.next;
        }
        head
    }
}