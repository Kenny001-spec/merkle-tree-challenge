const hashFunction = window.sha256;

function createMerkleTree() {
  try {
    const addressList = [
      "0x79f7d73aec01fad6d86c7bd93ada7f5c39e4678b",
      "0x3e43aad238335be1afd4a1fd90d11460bb0aec3b",
      "0xc04d826828240734ac0dfb01a98816dc72775059",
      "0x930b16f0cdbb1b9eba74fc29779d3bdf6e5b2a9a",
      "0x054af4269e35201f9204f6b896d72248c8894c1b",
    ];

    console.info("List of eligible addresses:", addressList);

    const hashedLeaves = addressList.map((addr) =>
      hashFunction(addr).toString()
    );
    
    const tree = new window.MerkleTree(hashedLeaves, hashFunction);
    const rootHash = tree.getRoot().toString("hex");

    console.info("Merkle Tree setup complete. Root hash:", rootHash);

    return { tree, rootHash };
  } catch (err) {
    console.error("Error during Merkle Tree creation:", err);
  }
}

// Validate if an address is eligible based on the Merkle Tree
function validateAddress() {
  const { tree, rootHash } = createMerkleTree();

  if (!tree || !rootHash) {
    console.error("Merkle Tree or root hash is missing.");
    return;
  }

  const inputAddress = document.getElementById("addressInput").value.trim();
  const leafHash = hashFunction(inputAddress).toString();
  const proof = tree.getProof(leafHash);
  const isEligible = tree.verify(proof, leafHash, rootHash);

  showResult(isEligible);
}

// It will display the eligibility check
function showResult(isEligible) {
  const resultElement = document.getElementById("result");
  const messageElement = resultElement.querySelector("p");

  resultElement.style.display = "block";
  resultElement.className = isEligible ? "result success" : "result failure";

  messageElement.textContent = isEligible
    ? "🎉Eligible for airdrop!"
    : "Not eligible for airdrop.";
}

document.addEventListener("DOMContentLoaded", () => {
  const checkButton = document.getElementById("checkButton");
  if (checkButton) {
    checkButton.addEventListener("click", validateAddress);
  } else {
    console.error("Button for checking eligibility is missing.");
  }
});
