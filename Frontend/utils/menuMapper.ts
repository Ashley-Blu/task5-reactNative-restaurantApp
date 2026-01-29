// utils/menuMapper.ts

export function mapMenu(menu: any[]) {
  const pickedForYou = menu
    .filter((item) => item.featured)
    .map((item) => ({
      ...item,
      image: { uri: item.image },
    }));

  const specials = menu
    .filter((item) => item.special)
    .map((item) => ({
      ...item,
      image: { uri: item.image },
    }));

  const categoryNames = Array.from(
    new Set(menu.map((item) => item.category)),
  );

  const categories = categoryNames.map((name) => ({
    id: name.toLowerCase(),
    title: name,
  }));

  const fullMenu = categories.map((cat) => ({
    id: cat.id,
    title: cat.title,
    type: cat.title.toLowerCase() === "drinks" ? "list" : "grid",
    items: menu
      .filter((item) => item.category === cat.title)
      .map((item) => ({
        ...item,
        image: { uri: item.image },
      })),
  }));

  return {
    pickedForYou,
    specials,
    categories,
    menu: fullMenu,
  };
}
