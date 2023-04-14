// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3286599/safe-rust-solution-free-of-using-heap/
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
        let mut lists = lists;
        if lists.len() == 0 {
            return None;
        }
        let n = lists.len() as i32 - 1;
        return Self::merge_slice(&mut lists, 0, n);
    }
    fn merge_slice(lists: &mut Vec<Option<Box<ListNode>>>, lo: i32, hi: i32) -> Option<Box<ListNode>> {
        if lo == hi {
            return lists[lo as usize].take();
        }
        if lo + 1 == hi {
            let l = lists[lo as usize].take();
            let h = lists[hi as usize].take();
            return Self::merge(l, h);
        } else {
            let mid = lo + (hi - lo) / 2;
            let l = Self::merge_slice(lists, lo, mid);
            let h = Self::merge_slice(lists, mid + 1, hi);
            return Self::merge(l, h);
        }
    }

    fn merge(l: Option<Box<ListNode>>, h: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut l = l;
        let mut h = h;
        let mut dummy_head = Box::new(ListNode::new(-1));
        let mut cur = &mut dummy_head;
        while l.is_some() || h.is_some() {
            if l.is_some() && h.is_some() {
                let mut l_node = l.unwrap();
                let mut h_node = h.unwrap();
                if l_node.val < h_node.val {
                    l = l_node.next.take();
                    h = Some(h_node);
                    cur.next = Some(l_node);
                } else {
                    h = h_node.next.take();
                    l = Some(l_node);
                    cur.next = Some(h_node);
                }
            } else if l.is_some() {
                cur.next = l;
                break;
            } else {
                cur.next = h;
                break;
            }
            cur = cur.next.as_mut().unwrap();
        }
        return dummy_head.next;
    }
}