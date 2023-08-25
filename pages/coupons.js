import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import myImage20 from "../assets/cou20.jgp.jpg";
import myImage40 from "../assets/c40.jpg";
import myImage50 from "../assets/c50.jpg";
import myImage60 from "../assets/c60.jpg";
import Image from "next/image";

const coupons = () => {
  ///////
  const router = useRouter();

  const [isHovered20, setHovered20] = useState(false);
  const [isHovered40, setHovered40] = useState(false);
  const [isHovered50, setHovered50] = useState(false);
  const [isHovered60, setHovered60] = useState(false);

  const [name, setname] = useState("");
  const [c20, setc20] = useState(0);
  const [c40, setc40] = useState(0);
  const [c50, setc50] = useState(0);
  const [c60, setc60] = useState(0);

  useEffect(() => {
    const fetchuser = async () => {
      const myuser = JSON.parse(localStorage.getItem("myuser"));

      let data = { token: myuser.token };
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/couponsapi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await a.json();
      // console.log(res);
      setname(res.name);
      setc20(res.c20);
      setc40(res.c40);
      setc50(res.c50);
      setc60(res.c60);
    };
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchuser();
      // console.log(c20);
    }
  }, []);

  ///////

  return (
    <section class="text-gray-600 body-font">
      <div class="container px-5 py-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
          <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Your Coupons
          </h1>
          <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
            List of all your coupons are listed below.
          </p>
        </div>
        <div class="container px-5 py-18 mx-auto flex flex-wrap">
          {c20 == 0 && c40 == 0 && c50 == 0 && c60 == 0 ? (
            <p class="lg:w-2/3 mx-auto leading-relaxed text-base">
              You don't have any coupons.
            </p>
          ) : (
            <p></p>
          )}

          {c20 == 1 ? (
            <div
              class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4 "
              onMouseOver={() => setHovered20(true)}
              onMouseLeave={() => setHovered20(false)}
            >
              {isHovered20 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                  src={myImage20}
                />
                // <Image width={100} height={10} src={logo} alt="" />
              )}
              {!isHovered20 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block  absolute inset-0"
                  src={myImage20}
                />
              )}

              <div
                class="text-center relative z-10 w-full"
                onMouseOver={() => setHovered20(true)}
                onMouseLeave={() => setHovered20(false)}
              >
                {isHovered20 && (
                  <div class="text-center relative z-10 w-full">
                    <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                      20% Off
                    </h2>
                    <p class="leading-relaxed">
                      Get a 20% OFF on all your purchase.
                    </p>
                    {/* <Link legacyBehavior href={"/mugs"}> */}

                    {/* </Link> */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}

          {c40 == 1 ? (
            <div
              class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
              onMouseOver={() => setHovered40(true)}
              onMouseLeave={() => setHovered40(false)}
            >
              {isHovered40 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                  src={myImage40}
                />
                // <Image width={100} height={10} src={logo} alt="" />
              )}
              {!isHovered40 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block  absolute inset-0"
                  src={myImage40}
                />
              )}

              <div
                class="text-center relative w-full "
                onMouseOver={() => setHovered40(true)}
                onMouseLeave={() => setHovered40(false)}
              >
                {isHovered40 && (
                  <div class="text-center relative w-full z-10">
                    <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                      40% Off
                    </h2>
                    <p class="leading-relaxed">
                      Get a 40% OFF on all your purchase.
                    </p>
                    {/* <Link legacyBehavior href={"/stickers"}> */}

                    {/* </Link> */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}

          {c50 == 1 ? (
            <div
              class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
              onMouseOver={() => setHovered50(true)}
              onMouseLeave={() => setHovered50(false)}
            >
              {isHovered50 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                  src={myImage50}
                />
                // <Image width={100} height={10} src={logo} alt="" />
              )}
              {!isHovered50 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block  absolute inset-0"
                  src={myImage50}
                />
              )}

              <div
                class="text-center relative w-full "
                onMouseOver={() => setHovered50(true)}
                onMouseLeave={() => setHovered50(false)}
              >
                {isHovered50 && (
                  <div class="text-center relative w-full z-10">
                    <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                      50% Off
                    </h2>
                    <p class="leading-relaxed">
                      Get a 50% OFF on all your purchase.
                    </p>
                    {/* <Link legacyBehavior href={"/stickers"}> */}

                    {/* </Link> */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}

          {c60 == 1 ? (
            <div
              class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4"
              onMouseOver={() => setHovered60(true)}
              onMouseLeave={() => setHovered60(false)}
            >
              {isHovered60 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block opacity-25 absolute inset-0"
                  src={myImage60}
                />
                // <Image width={100} height={10} src={logo} alt="" />
              )}
              {!isHovered60 && (
                <Image
                  alt="gallery"
                  // height={60}
                  class="w-full object-cover h-full object-center block  absolute inset-0"
                  src={myImage60}
                />
              )}

              <div
                class="text-center relative w-full "
                onMouseOver={() => setHovered60(true)}
                onMouseLeave={() => setHovered60(false)}
              >
                {isHovered60 && (
                  <div class="text-center relative w-full z-10">
                    <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">
                      60% Off
                    </h2>
                    <p class="leading-relaxed">
                      Get a 60% OFF on all your purchase.
                    </p>
                    {/* <Link legacyBehavior href={"/stickers"}> */}

                    {/* </Link> */}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </section>
  );
};

export default coupons;
