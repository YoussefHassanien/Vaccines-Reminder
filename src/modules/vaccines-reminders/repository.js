import Child from "../../models/childModel.js";
import Vaccine from "../../models/vaccineModel.js";

export const getAllVaccines = async () => {
  try {
    const vaccines = await Vaccine.find().select(
      "name description requiredAge"
    );

    if (!vaccines || vaccines.length === 0) {
      throw new Error("Vaccines not found!");
    }

    return vaccines;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllUsersChildren = async () => {
  try {
    const children = await Child.find()
      .select("name userId birthDate")
      .populate({
        path: "userId",
        select: "fName lName phoneNumber",
      });

    // Check if any children exist
    if (!children || children.length === 0) {
      throw new Error("Users' children not found!");
    }

    // Filter out children with missing user data before mapping
    const validChildren = children.filter((child) => {
      if (!child.userId) {
        console.warn(
          `Child ${child.name} (ID: ${child._id}) has missing user data - skipping`
        );
        return false;
      }
      return true;
    });

    // Check if we have any valid children after filtering
    if (validChildren.length === 0) {
      console.warn("No children with valid user data found");
      return [];
    }

    const formattedChildren = validChildren.map((child) => {
      return {
        user: {
          id: child.userId._id,
          name: `${child.userId.fName} ${child.userId.lName}`,
          phoneNumber: child.userId.phoneNumber,
        },
        child: {
          id: child._id,
          name: child.name,
          birthDate: child.birthDate,
        },
      };
    });

    const users = new Map();

    formattedChildren.forEach((child) => {
      const userId = child.user.id.toString();

      if (!users.has(userId)) {
        users.set(userId, {
          user: {
            id: userId,
            name: child.user.name,
            phoneNumber: child.user.phoneNumber,
            children: [],
          },
        });
      }

      // Add child to the user's children array
      users.get(userId).user.children.push(child.child);
    });

    return Array.from(users.values());
  } catch (error) {
    console.error(error);
    throw error;
  }
};
