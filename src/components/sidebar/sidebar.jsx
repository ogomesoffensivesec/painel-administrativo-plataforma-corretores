import ListSideBar from "./list-side-bar";
import { faker } from "@faker-js/faker";
import avatarImage from "@/assets/avatar.png";
export default function Sidebar() {
  const sex = faker.person.sex();
  const user = {
    displayName: faker.person.firstName(sex),
    avatar: avatarImage,
  };

  return (
    <div className="w-60  min-h-screen  flex flex-col justify-start border-solid border-r-[1px] border-zinc-300  bg-white dark:bg-stone-900 dark:border-stone-700 shadow-lg">
      <ListSideBar userFake={user} />
    </div>
  );
}
