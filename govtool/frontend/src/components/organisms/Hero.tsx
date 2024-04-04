import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trans } from "react-i18next";
import { Box, Link } from "@mui/material";

import { Button, Typography } from "@atoms";
import { IMAGES, PATHS } from "@consts";
import { useCardano, useModal } from "@context";
import { useScreenDimension, useTranslation } from "@hooks";
import { openInNewTab } from "@utils";

export const Hero = () => {
  const { isEnabled } = useCardano();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { isMobile, screenWidth } = useScreenDimension();
  const { t } = useTranslation();
  const IMAGE_SIZE = screenWidth < 640 ? 300 : screenWidth < 860 ? 400 : 600;

  const onClickVotingPower = useCallback(
    () =>
      openInNewTab("https://docs.sanchogov.tools/faqs/what-is-voting-power"),
    [],
  );

  return (
    <Box
      alignItems="center"
      display="flex"
      flex={1}
      marginTop={16}
      flexDirection="row"
      overflow="visible"
      position="relative"
      px={
        screenWidth < 640
          ? 3
          : screenWidth < 1512
          ? 9.375
          : screenWidth < 1728
          ? 14
          : screenWidth < 1920
          ? 27.375
          : screenWidth < 2560
          ? 39.375
          : 49.25
      }
    >
      <Box alignItems="center" flex={1} height="min-content">
        <Typography
          variant={screenWidth < 860 ? "headline2" : "headline1"}
          sx={{ whiteSpace: "pre-line" }}
          {...(screenWidth < 430 && { fontSize: 50 })}
        >
          {t("hero.headline")}
        </Typography>
        <Typography
          fontWeight={400}
          sx={{
            maxWidth: 630,
            my: 4,
            whiteSpace: "pre-line",
          }}
          variant="title2"
        >
          <Trans
            i18nKey="hero.description"
            components={[
              <Link
                data-testid="voting-power-link"
                onClick={onClickVotingPower}
                sx={{
                  cursor: "pointer",
                }}
              />,
            ]}
          />
        </Typography>
        <Button
          data-testid="hero-connect-wallet-button"
          onClick={() => {
            if (isEnabled) {
              navigate(PATHS.dashboard);
            } else {
              openModal({ type: "chooseWallet" });
            }
          }}
          size={isMobile ? "medium" : "extraLarge"}
        >
          {t("hero.connectWallet")}
        </Button>
      </Box>
      <Box
        flex={1}
        position="absolute"
        right={
          screenWidth <= 860
            ? -(IMAGE_SIZE / 4)
            : screenWidth <= 1440
            ? -(IMAGE_SIZE / 15)
            : screenWidth <= 1728
            ? screenWidth / 20
            : screenWidth / 11
        }
        top={-80}
        zIndex={-1}
      >
        <img
          alt="hero"
          src={IMAGES.heroImage}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
        />
      </Box>
    </Box>
  );
};
