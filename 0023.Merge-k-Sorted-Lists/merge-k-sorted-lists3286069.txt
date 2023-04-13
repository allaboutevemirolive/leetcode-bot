// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3286069/rust-elixir-merge-sort/
type OptNode = Option<Box<ListNode>>;

impl Solution {
    pub fn merge_k_lists(mut lists: Vec<OptNode>) -> OptNode {
        if lists.is_empty() {
			return None;
        }
		while lists.len() > 1 {
			for i in 0..(lists.len() + 1) / 2 {
				if i * 2 + 1 == lists.len() {
					lists[i] = lists[i * 2].take();
				}
				else {
					lists[i] = Self::merge_two(lists[i * 2].take(), lists[i * 2 + 1].take());
				}
			}
			lists.truncate((lists.len() + 1) / 2);
		}
		lists.pop().unwrap()
    }

	fn merge_two(mut list1: OptNode, mut list2: OptNode) -> OptNode {
		let mut dummy = Some(Box::new(ListNode::new(0)));
		let mut tail = &mut dummy;
		loop {
			match (list1.as_mut(), list2.as_mut()) {
				(Some(n1), Some(n2)) => {
					if n1.val < n2.val {
						let next = n1.next.take();
						tail.as_mut().unwrap().next = list1;
						tail = &mut tail.as_mut().unwrap().next;
						list1 = next;
					}
					else {
						let next = n2.next.take();
						tail.as_mut().unwrap().next = list2;
						tail = &mut tail.as_mut().unwrap().next;
						list2 = next;
					}
				}
				(Some(_), None) => {
					tail.as_mut().unwrap().next = list1;
					break;
				}
				(None, _) => {
					tail.as_mut().unwrap().next = list2;
					break;
				}
			}
		}
		dummy.unwrap().next
	}
}